function readFileAsDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => resolve(event.target?.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

function compressToWebP(dataUrl: string, maxWidth = 1280, quality = 0.75): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, maxWidth / img.width);
			const canvas = document.createElement('canvas');
			canvas.width = img.width * scale;
			canvas.height = img.height * scale;
			const context = canvas.getContext('2d')!;
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(img, 0, 0, canvas.width, canvas.height);
			canvas.toBlob((blob) => {
				if (blob) resolve(blob);
				else reject(new Error('Canvas toBlob failed'));
			}, 'image/webp', quality);
		};
		img.onerror = reject;
		img.src = dataUrl;
	});
}

export async function uploadImageFile(file: File, apiUrl: string): Promise<string> {
	if (!file.type.startsWith('image/')) throw new Error('Not an image file');

	let uploadBlob: Blob;
	let filename: string;

	if (file.type === 'image/gif') {
		// GIF: upload as-is to preserve animation
		uploadBlob = file;
		filename = `upload.gif`;
	} else {
		// All other formats: compress to WebP
		const dataUrl = await readFileAsDataUrl(file);
		uploadBlob = await compressToWebP(dataUrl);
		filename = `upload.webp`;
	}

	const formData = new FormData();
	formData.append('file', uploadBlob, filename);

	const response = await fetch(`${apiUrl}/images/upload`, {
		method: 'POST',
		credentials: 'include',
		body: formData,
	});

	if (!response.ok) {
		const message = await response.text();
		throw new Error(message || 'Upload failed');
	}

	const { url } = await response.json();
	return url;
}
