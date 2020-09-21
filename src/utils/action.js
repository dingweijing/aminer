/**
 *  Created by BoGao on 2019-1-10;
 *  增加延时调用方法 DelayTrigger;
 */

const debug = require('debug')('ACore:Auth');

// 延时调用一个方法;
class DelayTrigger {

  constructor(delay, action) {
    this.delay = delay || 200
    this.action = action
    this.timer = null
    if (!action) {
      throw new Error("Error! DelayTrigger must has parameter 'action'.")
    }
  }

  trigger(params) {
    if (this.timer != null) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      if (this.action) {
        this.action(params);
      }
    }, this.delay);
  }

}

export {
  DelayTrigger,
};
