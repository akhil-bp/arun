module.exports = {
    apps : [{
      name        : "example1",
      script      : "./bin/www",
      env : {
         "NODE_ENV": "production"
      }
    }]
   }


  //without sticky-session
  //  module.exports = {
  //   apps : [{
  //     name        : "myapp",
  //     script      : "./bin/www",
  //     instances : "max",
  //     exec_mode : "cluster",
  //     env : {
  //        "NODE_ENV": "production"
  //     }
  //   }]
  //  }