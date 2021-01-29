interface IFetch {
  read: Function;
}

export default (object: IFetch | undefined) => object && object.read();
