export const getUserImageSrc = (imagePath: string | undefined | null) => {
  if (imagePath) {
    return {uri: imagePath};
  } else {
    return require('@/assets/images/defaultUser.png');
  }
};
