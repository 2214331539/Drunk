启动方式如下，建议开两个 PowerShell 窗口。

  1. 启动后端和 admin

  cd D:\AFrontend\Drunk\backend
  npm run dev

  看到类似输出就表示成功：

  Drunk order backend running at http://localhost:8787
  Admin app available at http://localhost:8787/admin/

  admin 商家核销台地址：

  http://localhost:8787/admin/

  2. 启动用户侧 H5

  另开一个 PowerShell：

  cd D:\AFrontend\Drunk\front
  npm run dev

  H5 地址：

  http://localhost:3000

  使用流程

  1. 打开 http://localhost:3000，完成测试进入结果页。
  2. 在结果页选择酒，点击 下单生成码。
  3. 页面会生成核销二维码和核销码。
  4. 打开 http://localhost:8787/admin/。
  5. 商家可以扫码核销，也可以手动输入核销码查询并确认
     核销。
  6. 核销数据会保存在 backend/data/orders.json。

  注意：手机浏览器扫码通常需要 HTTPS；localhost 在电
  脑浏览器里可以测试。如果你用手机访问电脑服务，请用
  电脑局域网 IP，例如
  http://你的电脑IP:8787/admin/，但扫码权限可能被浏览器拦截，生产环境建议部署到
  HTTPS。