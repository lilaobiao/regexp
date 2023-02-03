
/*
正则表达式

小数点后跟两位小数

oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"


必须包含数字和字母的组合（其他的可有可无），8-16位
/^(?![^a-zA-Z]+$)(?!\D+$).{8,16}$/

如何深入理解上面的正则
(?![^a-zA-Z]+$)匹配一个位置，后面不是以纯非字母结尾，所以就是后面必须包含字母
(?!\D+$)  匹配一个位置，后面不是以纯非数字结尾，所以就是后面必须包含数字
后跟任意的8-16个字符


\b([a-z]+) \1\b，找出重复的单词
Is is the cost of of gasoline going up up?

// 匹配以 ing 结尾的单词  (?=exp)   后面是exp的位置，匹配一个位置，后面是exp
/\b\w+(?=ing\b)/.exec("I'm singing while you're dancing"); // 得到sing

(?!exp) 匹配一个位置，后面不是exp
\d{3}(?!\d)匹配三位数字，而且这三位数字的后面不能是数字；
\b((?!abc)\w)+\b匹配不包含连续字符串abc的单词。
\b(?!abc)\w+\b匹配不是以连续字符串abc开头的单词。


(?<=exp)   前面是exp的位置
/(?<=\bre)\w+\b/.exec('reading a book');  // 得到ading

(?<!exp)  匹配一个位置，该位置前面不是exp
(?<![a-z])\d{7}匹配前面不是小写字母的七位数字。

一个更复杂的例子：(?<=<(\w+)>).*(?=<\/\1>)匹配不包含属性的简单HTML标签内里的内容。(?<=<(\w+)>)指定了这样的前缀：被尖括号括起来的单词(比如可能是<b>)，然后是.*(任意的字符串),最后是一个后缀(?=<\/\1>)。注意后缀里的\/，它用到了前面提过的字符转义；\1则是一个反向引用，引用的正是捕获的第一组，前面的(\w+)匹配的内容，这样如果前缀实际上是<b>的话，后缀就是</b>了。整个表达式匹配的是<b>和</b>之间的内容(再次提醒，不包括前缀和后缀本身)。

/(?<=<(\w+)>).*(?=<\/\1>)/.exec('<div>aaa</div>')[0]; // aaa


/.p|Pd|Df|F/.test(‘Pdf’)


// 验证YYYY-MM-DD或YYYY/MM/DD的日期的合法性
const isDateStrValid = function(dateStr, split = '-'){
    let dateRegex = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/;
    if(split === '/'){
        dateRegex = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})\/(((0[13578]|1[02])\/(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)\/(0[1-9]|[12][0-9]|30))|(02\/(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))\/02\/29)$/;
    }
    return dateRegex.test(dateStr);
};

年的部分
([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})
可以换成更简单一点的写法
((?!0000)[\d]{4})
即4个不全为0的数字

*/

// 验证YYYY-MM-DD或YYYY/MM/DD的日期的合法性
const isDateStrValid = function(dateStr, split = '-'){
    const year = '((?!0000)[0-9]{4})';
    const bigMonth = '(0[13578]|1[02])___(0[1-9]|[12][0-9]|3[01])';
    const smallMonth = '(0[469]|11)___(0[1-9]|[12][0-9]|30)';
    const february = '02___(0[1-9]|[1][0-9]|2[0-8])';
    // 除闰年的2月29日外的其它所有日期
    const commonDay = `${year}___((${bigMonth})|(${smallMonth})|(${february}))`;

    // 能被400整除，或者能被4整除但不能被100整除的都是闰年，其余的年份均为平年
    // 四年一闰：([0-9]{2}(0[48]|[2468][048]|[13579][26])
    // 百年不闰，四百年再闰：(0[48]|[2468][048]|[13579][26])00
    const leapYears = '(([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))';
    const leapYears29 = `(${leapYears})___02___29`;

    let dateRegex = `^(${commonDay})|(${leapYears29})$`.replace(/___/g, split);
    const reg = new RegExp(dateRegex);
    const valid = reg.test(dateStr);
    console.log(valid);
    return valid;
};

isDateStrValid('0004-02-29'); // true
isDateStrValid('1900-02-29'); // false
isDateStrValid('1904-02-29'); // true
isDateStrValid('2000-02-29'); // true
isDateStrValid('2000-03-31'); // true
isDateStrValid('2000-04-31'); // false
// isDateStrValid('0004/02/29', '/');
// isDateStrValid('1900/02/29', '/');
// isDateStrValid('1904/02/29', '/');
// isDateStrValid('2000/02/29', '/');

