// 只需要維護這裡：name 中文、en 英文、color 書色、image 圖片路徑、url 課程分類網址。
// image 留空會使用內建線稿；url 留空不會跳轉。
const CATEGORIES = [
{name:'甜點 / 蛋糕',en:'Cakes & Desserts',color:'#e9b6aa',height:252,thickness:44,art:'cake',image:'',url:'',desc:'從日常甜點到精緻蛋糕，練習每一口的甜蜜。'},
{name:'麵包',en:'Bread',color:'#eed18a',height:278,thickness:36,art:'bread',image:'',url:'',desc:'揉麵、發酵與烘烤，找回麵包的香氣。'},
{name:'中式料理 / 甜點',en:'Chinese Cuisine',color:'#d6a38d',height:238,thickness:48,art:'dumpling',image:'',url:'',desc:'從熟悉的家常味，探索中式手作的細節。'},
{name:'餅乾',en:'Cookies',color:'#dfbc8e',height:258,thickness:35,art:'cookie',image:'',url:'',desc:'酥脆、鬆軟與香濃，做出自己的餅乾。'},
{name:'糖果',en:'Confectionery',color:'#d4b9d6',height:225,thickness:32,art:'candy',image:'',url:'',desc:'探索糖的變化，製作小巧而精緻的甜蜜。'},
{name:'丙級證照專區',en:'Baking Certification',color:'#b5c9c2',height:282,thickness:46,art:'cert',image:'',url:'',desc:'循序練習基本功，為烘焙檢定做好準備。'},
{name:'蔬食料理',en:'Plant-based Cooking',color:'#c4d39c',height:248,thickness:40,art:'veg',image:'',url:'',desc:'用植物性食材，創造豐富的日常餐桌。'},
{name:'寵物點心',en:'Pet Treats',color:'#b9cce0',height:265,thickness:38,art:'pet',image:'',url:'',desc:'為毛孩探索合適的手作點心。'}
];
const ART={cake:'<path d="M25 83h90M35 78V48h70v30M35 58q9 9 18 0t18 0t18 0t16 0M35 48l35-24 35 24M68 25q-15-18 0-17q15 1 0 17"/><path d="M45 70h50"/>',bread:'<path d="M20 72Q10 38 48 27Q81 10 119 45Q140 80 104 89H39Q22 88 20 72Z M45 33l18 27M68 27l19 30M92 32l15 23"/>',dumpling:'<path d="M17 76Q70 104 123 76M26 76h88M30 72Q35 30 70 25Q105 30 110 72Z M70 25v42M50 31l9 36M90 31l-9 36"/>',cookie:'<circle cx="57" cy="54" r="32"/><circle cx="93" cy="69" r="25"/><path d="M44 40l3 3m18-7l3 4M40 62l4 2m22-5l4 4m21-7l4 4m-8 16l4 3m12-7l3 3"/>',candy:'<path d="M42 39Q70 20 98 39V71Q70 90 42 71Z M42 43L18 28v54l24-15M98 43l24-15v54L98 67M55 42l28 28m-13-35l18 18"/>',cert:'<rect x="32" y="15" width="76" height="80" rx="3"/><path d="M47 32h46M47 45h46M47 58h25M87 82l-5 18 10-5 10 5-5-18"/><circle cx="92" cy="74" r="11"/>',veg:'<path d="M70 94V28M70 66Q19 64 24 23Q61 22 70 66M70 51Q117 53 117 12Q78 11 70 51M70 87Q32 91 27 67Q54 58 70 87"/>',pet:'<path d="M43 65q27-35 54 0q17 24-9 25q-18-10-36 0q-26-1-9-25Z"/><ellipse cx="34" cy="45" rx="9" ry="13"/><ellipse cx="57" cy="29" rx="9" ry="14"/><ellipse cx="83" cy="29" rx="9" ry="14"/><ellipse cx="106" cy="45" rx="9" ry="13"/>'};
