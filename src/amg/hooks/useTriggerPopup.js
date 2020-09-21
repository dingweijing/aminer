import { useEffect } from 'react'

// customized hooks.
const useTriggerPopup = (triggerRef, popupRef) => {
  let timer = null;

  useEffect(() => {

    //  -------------------------------------------------------
    const leaveDrop = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        // dropEl.current.style.visibility = 'hidden';
        popupRef.current.classList.remove('show');
      }, 200);
    }
    popupRef.current.addEventListener('mouseleave', leaveDrop, true)

    //  -------------------------------------------------------
    const overDrop = () => {
      clearTimeout(timer)
    }
    popupRef.current.addEventListener('mouseover', overDrop, true)

    //  -------------------------------------------------------
    const overIcon = () => {
      clearTimeout(timer)
      popupRef.current.classList.add('show');
    }
    triggerRef.current.addEventListener('mouseover', overIcon, true)

    //  -------------------------------------------------------
    const leaveIcon = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        popupRef.current.classList.remove('show');
      }, 200);
    }
    triggerRef.current.addEventListener('mouseleave', leaveIcon, true)

    //  -------------------------------------------------------
    const tapIcon = () => {
      if (popupRef.current.className.indexOf('show') !== -1) {
        popupRef.current.classList.remove('show');
      } else {
        popupRef.current.classList.add('show');
      }
    }
    triggerRef.current.addEventListener('touchend', tapIcon, true)

    //  -------------------------------------------------------
    return () => {
      popupRef.current.removeEventListener('mouseleave', leaveDrop, true)
      popupRef.current.removeEventListener('mouseover', overDrop, true)
      triggerRef.current.removeEventListener('mouseover', overIcon, true)
      triggerRef.current.removeEventListener('mouseleave', leaveIcon, true)
      triggerRef.current.removeEventListener('touchend', tapIcon, true)
    }
  }, [triggerRef, popupRef])

}

export default useTriggerPopup;
