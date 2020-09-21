export function addRippleEffect(e) {
  const target = e.target;
  if (target.tagName.toLowerCase() !== 'button') return false;
  const rect = target.getBoundingClientRect();
  let ripple = target.querySelector('.ripple');
  const maxValue = Math.max(rect.width, rect.height);
  if (!ripple) {
    ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.height = `${maxValue}px`;
    ripple.style.width = `${maxValue}px`;
    target.appendChild(ripple);
  }
  ripple.classList.remove('show');
  const top = e.clientY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
  const left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
  ripple.style.top = `${top}px`;
  ripple.style.left = `${left}px`;
  ripple.classList.add('show');
  return false;
}

export function formatTime(time, formatType = 'MM.dd,yyyy') {
  return new Date(time).format(formatType);
}
