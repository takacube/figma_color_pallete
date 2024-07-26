figma.showUI(__html__);

interface PluginMessage {
  type: string;
  color: string;
}

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === 'create-rectangles') {
    const hextColorList = msg.color.split(',');
    for (let i = 0; i < hextColorList.length; i++) {
      await createColorPalette({ type: 'create-rectangles', color: hextColorList[i] }, i);
    }

    figma.closePlugin();
  }
};

// HEXカラーをRGBに変換する関数
function hexToRgb(hex: string): RGB {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r: r / 255, g: g / 255, b: b / 255 };
}

const createColorPalette = async (msg: PluginMessage, num: number) => {
  const colorHex = !msg.color.includes("#") ? "#" + msg.color : msg.color;
    const colorRgb = hexToRgb(colorHex);

    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

    const topRect = figma.createRectangle();

    topRect.resize(100, 60);
    topRect.cornerRadius = 0; // Set a uniform corner radius
    topRect.fills = [{ type: 'SOLID', color: colorRgb }];
    topRect.y = 0;

    const bottomRect = figma.createRectangle();
    bottomRect.resize(100, 40);
    bottomRect.cornerRadius = 4;
    bottomRect.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    bottomRect.y = 60;
    
    const text = figma.createText()
    text.x = 50
    if (typeof text.fontName !== 'symbol') {
      await figma.loadFontAsync(text.fontName);
    }
    text.characters = colorHex;

    text.fontSize = 12
    text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
    text.textAlignHorizontal = 'CENTER'
    text.textAlignVertical = 'CENTER'
    text.y = 60 + (40 - text.height) / 2;

    const frame = figma.createFrame();
    frame.resize(100, 100);
    frame.cornerRadius = 4;
    frame.layoutMode = 'NONE';
    frame.appendChild(topRect);
    frame.appendChild(bottomRect);
    frame.appendChild(text);
    
    frame.x = figma.viewport.center.x - 50 + num * 110;
    frame.y = figma.viewport.center.y - 50;
    

    figma.currentPage.appendChild(frame);
}