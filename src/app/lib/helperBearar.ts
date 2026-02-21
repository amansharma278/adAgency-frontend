
const baseUrl = import.meta.env.VITE_BASE_URL;
export const makePostRequest=async(path, payload)=>{
        console.log(baseUrl)
    const response =await fetch(baseUrl+path,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            ...payload
        })
    });

    const data = await response.json()
console.log(data.email);
    if(!response.ok){
        return {"status": false};
    }

   return {data, "status": true};

}

export const makePostAuthrized=async(path, payload)=>{
        console.log(baseUrl)
    const response =await fetch(baseUrl+path,{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization":`${"Bearer " + localStorage.getItem("access")}`,
        },
        body:JSON.stringify({
            ...payload
        })
    });

    const data = await response.json()
console.log(data.email);
    if(!response.ok){
        return {"status": false};
    }

   return {data, "status": true};

}


export const makeGetRequest=async(path)=>{
    const response = await fetch(baseUrl + path, {
        method:"GET",
        headers:{
            "Authorization":`${"Bearer " + localStorage.getItem("access")}`,
        }
    });
    const data = await response.json();
    if(!response.ok){
        return {"status": false}
    }
    return {data, "status":true};
}