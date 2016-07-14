
(function ($, cornerstone, cornerstoneWebImageLoader) {

  "use strict";

  var canvas = document.createElement('canvas');
  var lastImageIdDrawn = "";

  /**
   * creates a cornerstone Image object for the specified Image and imageId
   *
   * @param image - An Image
   * @param imageId - the imageId for this image
   * @returns Cornerstone Image Object
   */
  function createImage(image, imageId)
  {
    // extract the attributes we need
    var rows = image.naturalHeight;
    var columns = image.naturalWidth;

    function getPixelData()
    {
      var imageData = getImageData();
      var imageDataData = imageData.data;
      var numPixels = image.naturalHeight * image.naturalWidth;
      var storedPixelData = new Uint8Array(numPixels * 4);
      var imageDataIndex = 0;
      var storedPixelDataIndex = 0;
      for(var i=0; i < numPixels; i++) {
        storedPixelData[storedPixelDataIndex++] = imageDataData[imageDataIndex++];
        storedPixelData[storedPixelDataIndex++] = imageDataData[imageDataIndex++];
        storedPixelData[storedPixelDataIndex++] = imageDataData[imageDataIndex++];
        storedPixelData[storedPixelDataIndex++] = 255; // alpha
        imageDataIndex++;
      }
      return storedPixelData;
    }

    function getImageData()
    {
      var context;
      if(lastImageIdDrawn !== imageId) {
        canvas.height = image.naturalHeight;
        canvas.width = image.naturalWidth;
        context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        lastImageIdDrawn = imageId;
      }
      else {
        context = canvas.getContext('2d');
      }
      return context.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
    }

    function getCanvas()
    {
      if(lastImageIdDrawn === imageId) {
        return canvas;
      }

      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      lastImageIdDrawn = imageId;
      return canvas;
    }

    function getImage()
    {
      return image;
    }

    // Extract the various attributes we need
    return {
      imageId : imageId,
      minPixelValue : 0, // calculated below
      maxPixelValue : 255, // calculated below
      slope: 1.0,
      intercept: 0,
      windowCenter : 128,
      windowWidth : 255,
      render: cornerstone.renderWebImage,
      getPixelData: getPixelData,
      getImageData: getImageData,
      getCanvas: getCanvas,
      getImage: getImage,
      //storedPixelData: extractStoredPixels(image),
      rows: rows,
      columns: columns,
      height: rows,
      width: columns,
      color: true,
      columnPixelSpacing: undefined,
      rowPixelSpacing: undefined,
      invert: false,
      sizeInBytes : rows * columns * 4 // we don't know for sure so we over estimate to be safe
    };
  }

  // steam the http and https prefixes so we can use standard web urls directly
  cornerstoneWebImageLoader.createImage = createImage;
  return cornerstoneWebImageLoader;
}($, cornerstone, cornerstoneWebImageLoader));
