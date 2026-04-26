# Drunk

项目现在拆为三部分：

- `front`: 用户侧 H5，原有测试和结果页都在这里。
- `backend`: 订单和核销 API，使用本地 JSON 文件保存订单记录。
- `admin`: 商家移动端核销台，由 `backend` 托管在 `/admin/`。

## 本地运行

启动后端：

```bash
cd backend
npm run dev
```

后端默认地址是 `http://localhost:8787`，admin 地址是 `http://localhost:8787/admin/`。

启动 H5：

```bash
cd front
npm run dev
```

H5 默认会请求 `http://localhost:8787`。如果后端部署在其他地址，在 `front` 中配置：

```bash
VITE_API_BASE_URL=https://your-api.example.com npm run build
```

## 业务流

用户在 `front` 的 `ResultPage` 点击“下单生成码”后，后端会生成待核销订单和二维码 payload。商家打开 `admin`，扫码后可查看酒品品类、下单时间、核销码和状态，点击“确认核销”后写入核销时间。

当前版本不包含支付和商家登录鉴权；正式上线前建议给 `admin` 和核销接口加登录态或门店密钥。
