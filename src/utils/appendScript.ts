export default (id: string, callback: Function) => {
  let js;
  const fjs = document.getElementsByTagName('script')[0];
  if (document.getElementById(id)) return;
  js = document.createElement('script');

  js.id = id;
  callback(js);

  // @ts-ignore
  fjs.parentNode.insertBefore(js, fjs);
};
