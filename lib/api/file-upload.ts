/**
 * 文件上传工具函数
 * 
 * 注意：实际实现需要集成文件存储服务（如 AWS S3、阿里云 OSS 等）
 * 这里提供接口定义和验证逻辑
 */

export interface FileUploadResult {
  url: string;
  format: string;
  size: number;
  filename: string;
}

export interface FileUploadOptions {
  maxSize: number; // 字节
  allowedFormats: string[];
  folder?: string; // 存储文件夹
}

/**
 * 验证文件
 */
export function validateFile(
  file: File,
  options: FileUploadOptions
): { valid: boolean; error?: string } {
  // 检查文件大小
  if (file.size > options.maxSize) {
    return {
      valid: false,
      error: `文件大小超过限制 ${Math.round(options.maxSize / 1024 / 1024)}MB`,
    };
  }

  // 检查文件格式
  const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase();
  if (!options.allowedFormats.includes(ext)) {
    return {
      valid: false,
      error: `不支持的文件格式: ${ext}，支持的格式: ${options.allowedFormats.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * 上传文件到存储服务
 * 
 * TODO: 集成实际的存储服务（AWS S3、阿里云 OSS 等）
 * 
 * @param file 文件对象
 * @param options 上传选项
 * @returns 上传结果（URL、格式、大小等）
 */
export async function uploadFile(
  file: File,
  options: FileUploadOptions
): Promise<FileUploadResult> {
  // 验证文件
  const validation = validateFile(file, options);
  if (!validation.valid) {
    throw new Error(validation.error || '文件验证失败');
  }

  // TODO: 实际实现文件上传逻辑
  // 示例：使用 AWS S3 SDK
  // const s3 = new AWS.S3();
  // const key = `${options.folder || 'uploads'}/${Date.now()}-${file.name}`;
  // const result = await s3.upload({
  //   Bucket: process.env.S3_BUCKET,
  //   Key: key,
  //   Body: Buffer.from(await file.arrayBuffer()),
  //   ContentType: file.type,
  // }).promise();
  // 
  // return {
  //   url: result.Location,
  //   format: file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase(),
  //   size: file.size,
  //   filename: file.name,
  // };

  // 临时返回模拟数据（实际应上传到存储服务）
  const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase();
  return {
    url: `https://example.com/uploads/${Date.now()}-${file.name}`,
    format: ext,
    size: file.size,
    filename: file.name,
  };
}

/**
 * 上传多个文件
 */
export async function uploadFiles(
  files: File[],
  options: FileUploadOptions
): Promise<FileUploadResult[]> {
  return Promise.all(files.map((file) => uploadFile(file, options)));
}

/**
 * 设计文件上传配置
 */
export const DESIGN_FILE_OPTIONS: FileUploadOptions = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedFormats: ['AI', 'PSD', 'SKETCH', 'FIGMA', 'PDF', 'EPS'],
  folder: 'templates/designs',
};

/**
 * 预览图上传配置
 */
export const PREVIEW_IMAGE_OPTIONS: FileUploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP'],
  folder: 'templates/previews',
};
