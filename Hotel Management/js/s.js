import prodb, {
    bulkcreate,
    createEle,
    getData,
    SortObj
  } from "./module.js";
  
  
  let db3 = prodb("Productdb3", {
    products: `++id, name, seller, price`
  });
  
  // input tags
  const userid3 = document.getElementById("userid3");
  const proname3 = document.getElementById("proname3");
  const seller3 = document.getElementById("seller3");
  const price3 = document.getElementById("price3");
  
  // create button
  const btncreate3 = document.getElementById("btn-create3");
  const btnread3 = document.getElementById("btn-read3");
  const btnupdate3 = document.getElementById("btn-update3");
  const btndelete3 = document.getElementById("btn-delete3");
  
  // user data
  
  // event listerner for create button
  btncreate3.onclick = (event3) => {
    // insert values
    let flag = bulkcreate(db3.products, {
      name: proname3.value,
      seller: seller3.value,
      price: price3.value
    });
    // reset textbox values
    //proname.value = "";
    //seller.value = "";
    // price.value = "";
    proname3.value = seller3.value = price3.value = "";
  
    // set id textbox value
    getData(db3.products, data => {
      userid3.value = data.id + 1 || 1;
    });
    table();
  
    let insertmsg = document.querySelector(".insertmsg");
    getMsg(flag, insertmsg);
  };
  
  // event listerner for create button
  btnread3.onclick = table;
  
  // button update
  btnupdate3.onclick = () => {
    const id = parseInt(userid3.value || 0);
    if (id) {
      // call dexie update method
      db3.products.update(id, {
        name: proname3.value,
        seller: seller3.value,
        price: price3.value
      }).then((updated) => {
        // let get = updated ? `data updated` : `couldn't update data`;
        let get = updated ? true : false;
  
        // display message
        let updatemsg = document.querySelector(".updatemsg");
        getMsg(get, updatemsg);
  
        proname3.value = seller3.value = price3.value = "";
        //console.log(get);
      })
    } else {
      console.log(`Please Select id: ${id}`);
    }
  }
  
  // delete button
  btndelete3.onclick = () => {
    db3.delete();
    db3 = prodb("Productdb3", {
      products: `++id, name, seller, price`
    });
    db3.open();
    table();
    textID(userid3);
    // display message
    let deletemsg = document.querySelector(".deletemsg");
    getMsg(true, deletemsg);
  }
  
  window.onload = event => {
    // set id textbox value
    textID(userid3);
  };
  
  
  
  
  // create dynamic table
  function table() {
    const tbody = document.getElementById("tbody");
    const notfound = document.getElementById("notfound");
    notfound.textContent = "";
    // remove all childs from the dom first
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.firstChild);
    }
  
  
    getData(db3.products, (data, index) => {
      if (data) {
        createEle("tr", tbody, tr => {
          for (const value in data) {
            createEle("td", tr, td => {
              td.textContent = data.price3 === data[value] ? `$ ${data[value]}` : data[value];
            });
          }
          createEle("td", tr, td => {
            createEle("i", td, i => {
              i.className += "fas fa-edit btnedit";
              i.setAttribute(`data-id`, data.id);
              // store number of edit buttons
              i.onclick = editbtn;
            });
          })
          createEle("td", tr, td => {
            createEle("i", td, i => {
              i.className += "fas fa-trash-alt btndelete";
              i.setAttribute(`data-id`, data.id);
              // store number of edit buttons
              i.onclick = deletebtn;
            });
          })
        });
      } else {
        notfound.textContent = "No record found in the database...!";
      }
  
    });
  }
  
  const editbtn = (event) => {
    let id = parseInt(event.target.dataset.id);
    db3.products.get(id, function (data) {
      let newdata = SortObj(data);
      userid3.value = newdata.id || 0;
      proname3.value = newdata.name || "";
      seller3.value = newdata.seller || "";
      price3.value = newdata.price || "";
    });
  }
  
  // delete icon remove element 
  const deletebtn = event => {
    let id = parseInt(event.target.dataset.id);
    db3.products.delete(id);
    table();
  }
  
  // textbox id
  function textID(textboxid) {
    getData(db3.products, data => {
      textboxid.value = data.id + 1 || 1;
    });
  }
  
  // function msg
  function getMsg(flag, element) {
    if (flag) {
      // call msg 
      element.className += " movedown";
  
      setTimeout(() => {
        element.classList.forEach(classname => {
          classname == "movedown" ? undefined : element.classList.remove('movedown');
        })
      }, 4000);
    }
  }