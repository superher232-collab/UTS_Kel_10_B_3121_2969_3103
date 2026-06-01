

# **4. Spesifikasi Fitur per Role**

## **4.1 CUSTOMER / USER / PENGGUNA**
### **TRACKING:**
* **Dashboard**: 3 metrics (aktif, dalam perjalanan, selesai)
* **Shipment detail**: status, kapal, ETA, rute, invoice
* **Tracking history**: log semua status changes dengan timestamp
* **Proof of delivery**: foto, signature (jika tersedia)
* **Notifications**: email/SMS alerts saat status change

### **SUPPORT:**
* **Live chat**: live chat dengan admin
* **File complaint/ticket**: membuat tiket/aduan (file complaint/ticket)
* **FAQ/help**: bantuan dan FAQ (FAQ/help)
* **Contact admin**: hubungi admin (contact admin)
* **Invoice management**: download, print

### **MANAGEMENT:**
* **Create shipment**: membuat shipment baru
* **Edit shipment**: hanya status DIPROSES
* **Cancel shipment**: hanya status DIPROSES
* **Bulk track**: melacak beberapa shipment sekaligus (bulk track multiple shipments)

---

## **4.2 ADMIN**
### **OPERATIONAL:**
* **Dashboard**: statistics, alerts, pending actions
* **Shipment CRUD**: full control
* **Vehicle management**: assign, track utilization
* **Status workflow**: enforce valid transitions
* **Bulk operations**: assign multiple shipments ke vehicle

### **ANALYTICS:**
* **Revenue report**: laporan pendapatan
* **Route analytics**: analisis rute
* **Vehicle utilization**: tingkat penggunaan kendaraan
* **Customer analytics**: analisis pelanggan
* **Trend forecasting**: prakiraan tren

### **SUPPORT:**
* **Customer management**: manajemen pelanggan
* **Complaint handling**: penanganan pengaduan
* **Compensation/refund**: kompensasi/pengembalian dana
* **Escalation workflow**: alur eskalasi

### **SYSTEM:**
* **User management**: manajemen pengguna
* **Settings & configuration**: pengaturan & konfigurasi
* **Notification templates**: template notifikasi
* **Audit logs**: log audit
* **Integration management**: shipping provider API

### **AUTOMATION:**
* **Auto-assign vehicle**: route & capacity based
* **Auto-notify customer**: notifikasi otomatis ke customer
* **Auto-generate invoice**: pembuatan invoice otomatis
* **Auto-flag delays**: penandaan keterlambatan otomatis

---

# **5. Aturan Bisnis & Validasi**
* Edit shipment (Customer): hanya status DIPROSES
* Cancel shipment (Customer): hanya status DIPROSES
* Auto-assign vehicle (Admin): route & capacity based