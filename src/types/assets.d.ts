// 图片文件类型声明
declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

// 音频文件类型声明
declare module '*.mp3' {
  const content: string;
  export default content;
}

declare module '*.wav' {
  const content: string;
  export default content;
}

declare module '*.ogg' {
  const content: string;
  export default content;
}

// 视频文件类型声明
declare module '*.mp4' {
  const content: string;
  export default content;
}

declare module '*.webm' {
  const content: string;
  export default content;
}

// 添加根目录的类型声明
declare module './*.mp3' {
  const content: string;
  export default content;
}

declare module './*.jpg' {
  const content: string;
  export default content;
}

declare module './*.jpeg' {
  const content: string;
  export default content;
}

declare module './*.png' {
  const content: string;
  export default content;
}

declare module './*.gif' {
  const content: string;
  export default content;
}