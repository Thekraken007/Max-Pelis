async function poke () {
    const res = await fetch ("https://pokeapi.co/api/v2/pokemon/ditto");
    const data = await res.json();
    console.log(data)  
}

poke();

function solution(date) {
  const fecha = (`${date.getDate()}${ date.getMonth()}${date.getFullYear()}`).split("").map(x => parseInt(x)).reduce((a,v)=> a + v, 0);
  return fecha > 9 ? fecha.toString().split("").map(x => parseInt(x)).reduce((a,v)=> a + v, 0) : fecha;
}


console.log(solution(new Date('10/13/1964')));
