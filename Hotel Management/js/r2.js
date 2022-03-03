import prodb, {
    bulkcreate,
    createEle,
    getData,
    SortObj
  } from "./module.js";
  
  
  let db2 = prodb("Productdb2", {
    products: `++id, name, seller, price`
  });
  
  // input tags
  const userid2 = document.getElementById("userid2");
  const proname2 = document.getElementById("proname2");
  const seller2 = document.getElementById("seller2");
  const price2 = document.getElementById("price2");
  
  // create button
  const btncreate2 = document.getElementById("btn-create2");
  const btnread2 = document.getElementById("btn-read2");
  const btnupdate2 = document.getElementById("btn-update2");
  const btndelete2 = document.getElementById("btn-delete2");
  
  // user data
  
  // event listerner for create button
  btncreate2.onclick = (event2) => {
    // insert values
    let flag = bulkcreate(db2.products, {
      name: proname2.value,
      seller: seller2.value,
      price: price2.value
    });
    // reset textbox values
    //proname.value = "";
    //seller.value = "";
    // price.value = "";
    proname2.value = seller2.value = price2.value = "";
  
    // set id textbox value
    getData(db2.products, data => {
      userid2.value = data.id + 1 || 1;
    });
    table();
  
    let insertmsg = document.querySelector(".insertmsg");
    getMsg(flag, insertmsg);
  };
  
  // event listerner for create button
  btnread2.onclick = table;
  
  // button update
  btnupdate2.onclick = () => {
    const id = parseInt(userid2.value || 0);
    if (id) {
      // call dexie update method
      db2.products.update(id, {
        name: proname2.value,
        seller: seller2.value,
        price: price2.value
      }).then((updated) => {
        // let get = updated ? `data updated` : `couldn't update data`;
        let get = updated ? true : false;
  
        // display message
        let updatemsg = document.querySelector(".updatemsg");
        getMsg(get, updatemsg);
  
        proname2.value = seller2.value = price2.value = "";
        //console.log(get);
      })
    } else {
      console.log(`Please Select id: ${id}`);
    }
  }
  
  // delete button
  btndelete2.onclick = () => {
    db2.delete();
    db2 = prodb("Productdb2", {
      products: `++id, name, seller, price`
    });
    db2.open();
    table();
    textID(userid2);
    // display message
    let deletemsg = document.querySelector(".deletemsg");
    getMsg(true, deletemsg);
  }
  
  window.onload = event => {
    // set id textbox value
    textID(userid2);
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
  
  
    getData(db2.products, (data, index) => {
      if (data) {
        createEle("tr", tbody, tr => {
          for (const value in data) {
            createEle("td", tr, td => {
              td.textContent = data.price2 === data[value] ? `$ ${data[value]}` : data[value];
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
    db2.products.get(id, function (data) {
      let newdata = SortObj(data);
      userid2.value = newdata.id || 0;
      proname2.value = newdata.name || "";
      seller2.value = newdata.seller || "";
      price2.value = newdata.price || "";
    });
  }
  
  // delete icon remove element 
  const deletebtn = event => {
    let id = parseInt(event.target.dataset.id);
    db2.products.delete(id);
    table();
  }
  
  // textbox id
  function textID(textboxid) {
    getData(db2.products, data => {
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