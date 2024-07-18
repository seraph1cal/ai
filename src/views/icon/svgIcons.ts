export const svgIcons = () => {
  const svgFiles = import.meta.glob('../../assets/icons/*.svg', { eager: true });
  const fileNameArr: string[] = [];
  for (const path in svgFiles) {
    const fileName = path.split('/').pop()?.split('.').shift();
    fileNameArr.push(fileName);
  }
  return fileNameArr;
};
