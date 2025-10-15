<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>
      欢迎来到你的Vue应用！<br>
      你可以开始编辑这个组件来构建你的应用。
    </p>
    <button @click="count++">点击我：{{ count }}</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      default: '你好 Vue!'
    }
  },
  data() {
    return {
      count: 0
    }
  }
}
</script>

<style scoped>
.hello {
  margin: 20px auto;
  max-width: 600px;
}

h2 {
  color: #42b883;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #369870;
}
</style>
