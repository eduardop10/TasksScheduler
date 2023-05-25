generateAleatoryEmailAndPassword= (size) =>{
    function getAleatoryName(size){
  
      let name="";
    
      for (wordCounter=1;wordCounter<=size;wordCounter++){
    
        name=name +  getAleatoryLetter();
    
      }
    
      return {email: `${name}@email.com`,password: name};
    
    }
    
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function getAleatoryLetter(){
    
      let listLetters="ABCDEFGHIJKLMNOPQRSTUVYWXZ";
      let aleatoryNumber=getRandomInt(0, 25);
    
      return listLetters.substring(aleatoryNumber,aleatoryNumber+1);
    
    }
    return getAleatoryName(size)
  }

  module.exports= {generateAleatoryEmailAndPassword}