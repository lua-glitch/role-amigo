body = document.querySelector("body#body")
let obj = [{
    titulo: "Titulo-1",
    horario: "10:00",
    descricao: "Descricao-1"
},{
    titulo: "Titulo-2",
    horario: "11:00",
    descricao: "Descricao-2"
},{
    titulo: "Titulo-3",
    horario: "12:00",
    descricao: "Descricao-3"
},{
    titulo: "Titulo-4",
    horario: "13:00",
    descricao: "Descricao-4"
}]
obj.forEach (e=>{
    let kuzu = document.createElement("div");
    kuzu.className = "kuzu"
    kuzu.id = "lugar1"

    let caxa = document.createElement("div");
    caxa.className = "caxa"
    
    let titoGand = document.createElement("h1");
    titoGand.className = "tito-gand"
    titoGand.innerText = "aquió"

    let titoPqn = document.createElement("h2");
    titoPqn.className = "tito-pqn"
    titoPqn.innerText = "aquitbm"

    body.appendChild(kuzu)
    kuzu.appendChild(caxa)
    caxa.append([titoGand,titoPqn])
})
/* <div class="kuzu" id="lugar1"> 
        <div class="caxa" style="background-color: rgb(247, 217, 217);"> 
            <h1 class="tito-gand">aquió</h1>
            <h4 class="tito-pqn">aquitbm</h4>
        </div>
    </div> */let 