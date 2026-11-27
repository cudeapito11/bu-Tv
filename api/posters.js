module.exports = async function(req,res){
 const token=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNWYwYTcyMDgzYThmODkxYWY3YTQ5YzA1ZGYwOGY0ZCIsIm5iZiI6MTc3ODExNDc2Mi45MzgsInN1YiI6IjY5ZmJlMGNhYzVkNDQ3MTQ3YmM0N2YxOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dgYe5njKHGZIWD4vrl_PfMpajvKSnauymPnfCiOKPQA;
 if(!token)return res.status(503).json({error:'Configure TMDB_API_TOKEN'});
 try{
 const lists=await Promise.all(['movie','tv'].map(async type=>{
 const r=await fetch(`https://api.themoviedb.org/3/${type}/popular?language=pt-BR&page=1`,{headers:{Authorization:`Bearer ${token}`,accept:'application/json'}});
 if(!r.ok)throw Error('TMDB '+r.status);
 const data=await r.json();return data.results.filter(x=>x.poster_path).slice(0,15).map(x=>({src:'https://image.tmdb.org/t/p/w342'+x.poster_path,alt:x.title||x.name}));
 }));res.setHeader('Cache-Control','s-maxage=3600, stale-while-revalidate=86400');return res.status(200).json({movies:lists[0],series:lists[1]});
 }catch(e){return res.status(502).json({error:'Não foi possível consultar TMDB'});}
};
