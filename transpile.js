function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

var uniqueId = uuidv4();

// Send code to transpile
function transpile(javaCode) {
    
    let formData = new FormData();
    formData.append('javaCode', javaCode);
    formData.append('tsout', true);
    formData.append('tid', uniqueId);
    
    return new Promise( (resolve, reject) => {
        //let transpile_host = 'http://localhost:8580/transpile';
        //let transpile_host = 'https://api.operatoroverload.com/jsweet/transpile';
        let transpile_host = 'https://transpile.c3d.io/transpile';
        fetch(transpile_host,
              {
                  method: 'POST',
                  mode: 'cors',
                  cache: 'no-cache',
                  body: formData
              }
        ).then( response => {
            if (response.ok) {
                return response.json();
            } else {
                reject(response);
            }
        }).then( json => {
            console.log(json);
            json.jsout = ts.transpile(json.tsout);
            if (json.errors && json.errors.length > 0) {
                reject(json.errors);
            } else {
                resolve(json.jsout);
            }
        })
    });
}
