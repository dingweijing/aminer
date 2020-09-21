const exportJsonToCSV = (name, data) => {
  console.log(data, 'data')
  if (!data) {
    alert('没有数据');
    return null;
  }
  const link = window.document.createElement('a');
  const bom = '\uFEFF';
  const newStr = `${bom}${data}`;
  const blob = new Blob([newStr]);
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${name}.csv`);
  link.click();
};

export default exportJsonToCSV;
