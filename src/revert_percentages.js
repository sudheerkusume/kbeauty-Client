const fs = require('fs');
const path = require('path');

const dir = 'c:\\React\\react nov\\project1\\src';
const target = '<span className="discount-val-p">{discountPercent}</span><span className="animated-percent">%</span>';
const replacement = '<span className="discount-val-p">{discountPercent}<span className="animated-percent">%</span></span>';

function walk(d) {
  let r = [];
  const list = fs.readdirSync(d);
  list.forEach(f => {
    f = path.join(d, f);
    const stat = fs.statSync(f);
    if (stat && stat.isDirectory()) {
      r = r.concat(walk(f));
    } else if (f.endsWith('.jsx')) {
      r.push(f);
    }
  });
  return r;
}

walk(dir).forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes(target)) {
    content = content.split(target).join(replacement);
    fs.writeFileSync(f, content, 'utf8');
    console.log('Reverted layout in ' + f);
  }
});
