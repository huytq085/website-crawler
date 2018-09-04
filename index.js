var Crawler = require("crawler");
var count = 0;
let arrs = [];

const BASE_URL = 'http://gialong.com.vn';
const DANH_MUC = 'danh-muc';
const LIST_DANH_MUC = [
  'laptop-va-phu-kien',
  'linh-kien-may-tinh',
  'pc-dong-bo-3/pc-dong-bo',
  'pc-gaming',
  'gaming-gear',
  'thiet-bi-van-phong',
  'thiet-bi-luu-tru-va-phu-kien',
  'thiet-bi-am-thanh-nghe-nhin',
  'do-choi-phu-kien-oto',
  'do-choi-phu-kien-dien-thoai',
  'thiet-bi-an-ninh-giam-sat',
  'thiet-bi-mang',
  'dien-may-va-gia-dung'
]
let uris = [];
for (const item of LIST_DANH_MUC) {
  const uri = `${BASE_URL}/${DANH_MUC}/${item}`;
  uris.push(uri);

}
// Require library
var excel = require('excel4node');

// Create a new instance of a Workbook class
var workbook = new excel.Workbook();

var c = new Crawler({
  maxConnections: 10,
  userAgent: 'Mozilla/5.0',
  // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      var $ = res.$;

      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      console.log(res.request.uri.pathname.split('/')[2]);
      console.log(res.request.uri);
      console.log('hasPage: ' + res.request.uri.pathname.split('/')[3])
      let i = 2;
      let j = 1;
      let worksheet;
      worksheet = workbook.addWorksheet(res.request.uri.pathname.split('/')[2]);
      // Set value of cell A1 to 100 as a number type styled with paramaters of style
      worksheet.cell(1, 1).string('Name');
      worksheet.cell(1, 2).string('Link');
      // Get the second last element of pages. Loop: 2->total
      let pageHref = $('.page-number').eq($('.page-number').length - 2).attr('href');
      if (pageHref && $('.page-number').eq(0).hasClass('current')) {
        let pageHrefSplit = pageHref.split('/');
        let totalPage = pageHrefSplit[pageHrefSplit.length - 2];
        let uris = [];
        if (totalPage) {
          for (let i = 2; i <= totalPage; i++) {
            uris.push(`${res.request.uri.href}/page/${i}`);
          }
        }
        c.queue(uris);
      }
      let products = $('.name.product-title a');
      for (const title in products) {
        if (products.hasOwnProperty(title)) {
          const element = products[title];

          if ($(element).attr('href')) {
            console.log(count++)
            worksheet.cell(i, j).string($(element).text());
            worksheet.cell(i++, j + 1).string($(element).attr('href'));
          }
        }
      }
    }
    done();
  }
});

console.log(uris);
c.queue(uris);

// Create excel

setTimeout(() => {
  console.log('tao excel ne')
  workbook.write('Excel.xlsx');
}, 10000);