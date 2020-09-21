/**
 *  Created by BoGao on 2018-03-14;
 */
const getRootTop = (menuID) => {
  const id = `${menuID}_ROOT`;
  const treeNode = document.getElementById(id);
  if (treeNode) {
    // console.log(">>>>>>>>", getElementTop(treeNode))
    // return treeNode.offsetTop;
    return getElementTop(treeNode);
  }
  return 0; // TODO 猜一个.
};

const getElementTop = (element) => {
  let actualTop = element.offsetTop;
  let current = element.offsetParent;

  while (current && current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return actualTop;
};

const createMenu = (menuID) => {
  const rootTop = getRootTop(menuID);

  const menuElm = document.getElementById(menuID);
  if (!menuElm) {
    // console.error(`can't find element ${menuID}`);
  }
  return {
    menuElm, rootTop,
    show(target, data) {
      this.rootTop = getRootTop(menuID);
      this.menuElm = document.getElementById(menuID);
      const top = getElementTop(target) - this.rootTop - 12;
      if (this.menuElm) {
        // 如果已经显示了框，直接换到另一个按钮上，那么不延时，直接出现。
        const alreadyShown = this.menuElm.firstElementChild.style.visibility === 'visible';
        const dealy = alreadyShown ? 0 : 100;
        setTimeout(() => {
          this.menuElm.style.top = `${top}px`;
          this.menuElm.firstElementChild.style.visibility = 'visible';
          const id = data && data.id;
          const nodetype = data && data.nodetype;
          this.menuElm.dataset.item = JSON.stringify({ id, nodetype });
        }, dealy);

      }
    },
  };
};

const init = (menuID) => {
  return createMenu(menuID);
};

export default { init };
