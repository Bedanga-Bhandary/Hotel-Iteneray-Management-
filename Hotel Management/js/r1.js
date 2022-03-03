import prodb, {
    bulkcreate,
    createEle,
    getData,
    SortObj
  } from "./module.js";
  
  
  let db1 = prodb("Productdb1", {
    products: `++id, name, seller, price`
  });
  
  // input tags
  const userid1 = document.getElementById("userid1");
  const proname1 = document.getElementById("proname1");
  const seller1 = document.getElementById("seller1");
  const price1 = document.getElementById("price1");
  
  // create button
  const btncreate1 = document.getElementById("btn-create1");
  const btnread1 = document.getElementById("btn-read1");
  const btnupdate1 = document.getElementById("btn-update1");
  const btndelete1 = document.getElementById("btn-delete1");
  
  // user data
  
  // event listerner for create button
  btncreate1.onclick = (event1) => {
    // insert values
    let flag = bulkcreate(db1.products, {
      name: proname1.value,
      seller: seller1.value,
      price: price1.value
    });
    // reset textbox values
    //proname.value = "";
    //seller.value = "";
    // price.value = "";
    proname1.value = seller1.value = price1.value = "";
  
    // set id textbox value
    getData(db1.products, data => {
      userid1.value = data.id + 1 || 1;
    });
    table();
  
    let insertmsg = document.querySelector(".insertmsg");
    getMsg(flag, insertmsg);
  };
  
  // event listerner for create button
  btnread1.onclick = table;
  
  // button update
  btnupdate1.onclick = () => {
    const id = parseInt(userid1.value || 0);
    if (id) {
      // call dexie update method
      db1.products.update(id, {
        name: proname1.value,
        seller: seller1.value,
        price: price1.value
      }).then((updated) => {
        // let get = updated ? `data updated` : `couldn't update data`;
        let get = updated ? true : false;
  
        // display message
        let updatemsg = document.querySelector(".updatemsg");
        getMsg(get, updatemsg);
  
        proname1.value = seller1.value = price1.value = "";
        //console.log(get);
      })
    } else {
      console.log(`Please Select id: ${id}`);
    }
  }
  
  // delete button
  btndelete1.onclick = () => {
    db1.delete();
    db1 = prodb("Productdb1", {
      products: `++id, name, seller, price`
    });
    db1.open();
    table();
    textID(userid1);
    // display message
    let deletemsg = document.querySelector(".deletemsg");
    getMsg(true, deletemsg);
  }
  
  window.onload = event => {
    // set id textbox value
    textID(userid1);
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
  
  
    getData(db1.products, (data, index) => {
      if (data) {
        createEle("tr", tbody, tr => {
          for (const value in data) {
            createEle("td", tr, td => {
              td.textContent = data.price1 === data[value] ? ` ${data[value]}` : data[value];
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
    db1.products.get(id, function (data) {
      let newdata = SortObj(data);
      userid1.value = newdata.id || 0;
      proname1.value = newdata.name || "";
      seller1.value = newdata.seller || "";
      price1.value = newdata.price || "";
    });
  }
  
  // delete icon remove element 
  const deletebtn = event => {
    let id = parseInt(event.target.dataset.id);
    db1.products.delete(id);
    table();
  }
  
  // textbox id
  function textID(textboxid) {
    getData(db1.products, data => {
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