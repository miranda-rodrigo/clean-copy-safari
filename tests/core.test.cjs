const {test}=require('node:test');const a=require('node:assert/strict');const C=require('../extension/core.js');
test('Bible title, scope and translation',()=>{a.equal(C.title('Salmos 40 | ARA | Bíblia Online','https://www.bibliaonline.com.br/ara/sl/40'),'Salmos 40 · ARA');a.equal(C.title('Title | Company','https://example.com'),'Title | Company');});
test('Tracking removal preserves content and encoding',()=>a.equal(C.cleanURL('https://example.com/a?utm_source=x&q=a%20b&t=42&v=4#verse-3'),'https://example.com/a?q=a%20b&t=42&v=4#verse-3'));
test('Signed URLs untouched',()=>{const u='https://example.com/a?sig=abc&utm_source=x';a.equal(C.cleanURL(u),u);});
test('Disabled cleaning exact round trip',()=>{const u='https://example.com?utm_source=x';a.equal(C.cleanURL(u,false),u);});
test('Reject unsafe destinations',()=>a.throws(()=>C.format({title:'x',url:'javascript:alert(1)'})));
test('Rich text escapes page-controlled text',()=>{const p=C.format({title:'<script>x</script>',url:'https://example.com',quote:'<img src=x>\nhello'},'rich');a.ok(!p.html.includes('<script>'));a.ok(p.html.includes('&lt;img'));});
test('Quote line breaks and Markdown title escaping',()=>{const p=C.format({title:'A [B]',url:'https://example.com/a(b)',quote:'one\n\ntwo'});a.ok(p.text.startsWith('> one\n> \n> two'));a.ok(p.text.includes('A \\[B\\]'));a.ok(p.text.includes('a%28b%29'));});
