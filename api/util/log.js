const log = (msg, ...args) => {
  console.log(msg + ', {' + args.reduce((p, c, i) => i % 2 == 0 ? p + `, "${c}": ` : `"${c}"`) + '}');
}

export default log