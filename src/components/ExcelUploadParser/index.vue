<template>
  <div>
    <el-upload
        class="upload-demo"
        drag
        action="#"
        :show-file-list="false"
        :before-upload="handleFileChange">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div v-if="parsedData">
      <slot :data="parsedData"></slot>
    </div>
  </div>

</template>

<script>
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      file: null,
      parsedData: null,
    };
  },
  methods: {
    handleFileChange(event) {
      this.file = event
      this.parseFile();
      return false;
    },
    parseFile() {
      if (!this.file) {
        alert('请选择一个文件');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // 将第一行作为键，剩余行作为值
        const headers = json.shift(); // 移除第一行并保存为headers
        const result = json.map(row => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });

        // 触发事件，传递解析后的数据
        this.$emit('data-parsed', result);
      };
      reader.readAsBinaryString(this.file);
      return false;
    },
  },
};
</script>
