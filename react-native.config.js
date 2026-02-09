module.exports = {
  dependencies: {
    '@react-native-community/geolocation': {
      platforms: {
        android: {
          // Esto desactiva el autolinking solo para la parte nativa C++
          libraryName: null, 
        },
      },
    },
  },
};