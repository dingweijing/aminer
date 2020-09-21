/**
 *  Created by xenaluo on 2019-04-16;
 */
const cardWidth = 384;

const getElementPosition = element => {
  let actualTop = element.offsetTop;
  let actualLeft = element.offsetLeft;
  const actualWidth = element.offsetWidth;
  let current = element.offsetParent;
  while (current && current !== null) {
    actualTop += current.offsetTop;
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  return { actualTop, actualLeft, actualWidth };
};

const getRootPosition = id => {
  const rootNode = document.getElementById(`${id}_ROOT`); // ! BADBAD
  if (!window.getComputedStyle || !rootNode) {
    return false
  }
  const { position } = getComputedStyle(rootNode);
  if (!position || position === 'static') {
    rootNode.style.position = 'relative'
  }
  return getElementPosition(rootNode);
}


let cardtimer = null;
const createMenu = id => {
  const rootPosition = getRootPosition(id);
  const cardNode = document.getElementById(id);
  if (!cardNode) {
    // console.error(`can't find element ${menuID}`);
  }
  return {
    cardNode,
    rootPosition,
    show(target, sid, position) {
      this.rootPosition = getRootPosition(id);
      this.cardNode = document.getElementById(id);
      const elementPosition = getElementPosition(target);
      const top = elementPosition.actualTop - this.rootPosition.actualTop + (position && position.y || 20);
      const left = elementPosition.actualLeft - this.rootPosition.actualLeft + (position && position.x || 8);

      if (this.cardNode) {
        const distance = this.cardNode.style.top.replace('px', '') - 0 - top;
        if (Math.abs(distance) < 100) {
          this.cardNode.style.transition = 'all 100ms cubic-bezier(.28,.6,.7,.42)';
        } else {
          this.cardNode.style.transition = 'none';
        }

        this.cardNode.dataset.item = JSON.stringify({ id: sid });
        // 如果已经显示了框，直接换到另一个按钮上，那么不延时，直接出现。
        const alreadyShown = this.cardNode.style.visibility === 'visible';
        const dealy = alreadyShown ? 0 : 240;
        cardtimer = setTimeout(() => {
          this.cardNode.style.position = 'absolute';
          this.cardNode.style.top = `${top || 0}px`;
          // if (boundary && left + cardWidth > this.rootPosition.actualWidth) {
          if (document.body.clientWidth < 410) {
            return;
          }
          // if (
          //   (left + elementPosition.actualWidth + this.rootPosition.actualLeft - cardWidth - 10 < 0) &&
          //   (left + this.rootPosition.actualLeft + cardWidth + 17 > document.body.clientWidth)
          // ) {
          //   this.cardNode.style.left = `${((this.rootPosition.actualWidth) / 2) - (cardWidth / 2)}px`;
          // }
          if (left + this.rootPosition.actualLeft + cardWidth + 17 > document.body.clientWidth) {
            this.cardNode.style.left = `${document.body.clientWidth - this.rootPosition.actualLeft - cardWidth - 17}px`;
            // this.cardNode.style.left = `${left + elementPosition.actualWidth - cardWidth - 10}px`;
          } else {
            this.cardNode.style.left = `${left || 0}px`;
            // this.cardNode.style.right = 'auto';
          }
          this.cardNode.style.visibility = 'visible';
          this.timer = null;
        }, dealy);
      }
    },
  };
};

const getAngle = target => {
  const st = window.getComputedStyle(target, null);
  const tr = st.getPropertyValue('-webkit-transform') ||
    st.getPropertyValue('-moz-transform') ||
    st.getPropertyValue('-ms-transform') ||
    st.getPropertyValue('-o-transform') ||
    st.getPropertyValue('transform') ||
    'FAIL';
  // With rotate(30deg)...
  // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
  console.log(`Matrix: ${tr}`);
  const values = tr.split('(')[1].split(')')[0].split(',');
  const a = values[0];
  const b = values[1];
  const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
  return (angle);
}

const createCard = id => ({
  show(target, param) {
    const angle = getAngle(target);
    console.log('angle', angle); // TODO calc position

    this.cardNode = document.getElementById(id);

    const rootNode = document.getElementById(`${id}_ROOT`);
    const rootPosition = rootNode.getBoundingClientRect();
    const targetPosition = target.getBoundingClientRect();
    const bodyWidth = document.body.clientWidth;
    const cardWIdth = this.cardNode.clientWidth;
    const totalWidth = cardWIdth + targetPosition.left;

    const top = targetPosition.top - rootPosition.top + 10;
    let left = targetPosition.left - rootPosition.left + 30;

    if (totalWidth + 20 > bodyWidth) {
      left = targetPosition.left - rootPosition.left - cardWIdth + 20;
    }


    this.cardNode.dataset.item = JSON.stringify(param);
    this.cardNode.style.position = 'absolute';
    this.cardNode.style.top = `${top || 0}px`;
    this.cardNode.style.left = `${left || 0}px`;
    this.cardNode.style.visibility = 'visible';
    // this.timer = null;
  }
})

const preventShow = () => {
  if (cardtimer) {
    clearTimeout(cardtimer);
    cardtimer = null;
  }
}

const init = menuID => createMenu(menuID);

const initInSvg = rootID => createCard(rootID)

export default { init, preventShow, initInSvg };
