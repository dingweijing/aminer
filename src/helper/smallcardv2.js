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

const getElementTop = element => {
  let scrollTop = 0;
  let current = element;
  while (current && current !== null) {
    if (current.scrollTop) {
      scrollTop += current.scrollTop;
    }
    current = current.parentNode || current.parentElement;
  }
  return { scrollTop };
};

function CreateCard(cardref) {
  this.cardNode = cardref;
  this.cardtimer = null;

  this.show = ({ target, sid, position, params }) => {
    const elementPosition = getElementPosition(target);

    const { scrollTop } = getElementTop(target);
    const top = elementPosition.actualTop + ((position && position.y) || 20) - scrollTop;
    const left = elementPosition.actualLeft + ((position && position.x) || 8);
    if (this.cardNode) {
      const distance = this.cardNode.style.top.replace('px', '') - 0 - top;
      if (Math.abs(distance) < 20) {
        this.cardNode.style.transition = 'all 100ms cubic-bezier(.28,.6,.7,.42)';
      } else {
        this.cardNode.style.transition = 'none';
      }

      this.cardNode.dataset.item = JSON.stringify({ id: sid, ...params });
      //   // 如果已经显示了框，直接换到另一个按钮上，那么不延时，直接出现。
      const alreadyShown = this.cardNode.style.visibility === 'visible';
      const dealy = alreadyShown ? 0 : 240;
      this.cardtimer = setTimeout(() => {
        this.cardNode.style.top = `${top || 0}px`;

        if (document.body.clientWidth < 410) {
          return;
        }
        if (left + cardWidth + 17 > document.body.clientWidth) {
          this.cardNode.style.left = `${document.body.clientWidth - cardWidth - 17}px`;
        } else {
          this.cardNode.style.left = `${left || 0}px`;
        }
        this.cardNode.style.visibility = 'visible';
        //     this.timer = null;
      }, dealy);
    }
  };
}

const init = menuID => new CreateCard(menuID);

// const initInSvg = rootID => createCard(rootID)

export default { init };

export {
  getElementPosition, getElementTop
}
