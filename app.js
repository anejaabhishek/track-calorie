// Storage Controller
const StorageCtrl = (function () {
  // Public Methods

  return {
    storeItem: function (item) {
      let items = [];
      // Check if there are any item(s)

      if (localStorage.getItem("items") === null) {
        items = [];
        // push the item
        items.push(item);

        // set local storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));

        //  push the new item
        items.push(item);

        //  reset local storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    getItemsFromStorage: function () {
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },

    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },

    delteItemFromStorage: function (itemID) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (itemID === item.id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },

    clearAllFromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // Public Methods
  return {
    getItems: function () {
      return data.items;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    addItem: function (name, calories) {
      // Create ID

      let ID;

      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemByID: function (id) {
      let found = null;

      data.items.forEach(function (item) {
        if (item.id === id) found = item;
      });

      return found;
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    updateItem: function (name, calories) {
      // Calories to number

      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },

    deleteItem: function (id) {
      // get ids
      ids = data.items.map(function (item) {
        return item.id;
      });

      const index = ids.indexOf(id);

      //   remove item
      data.items.splice(index, 1);
    },

    clearAllItems: function () {
      data.items = [];
    },

    getTotalCalories: function () {
      let total = 0;

      data.items.forEach(function (item) {
        total += item.calories;
      });

      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

// UI Controller

const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };

  return {
    populateItemList: function (items) {
      let html = "";

      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name} : </strong> <em>${item.calories} calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`;
      });

      //   Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },

    getSelectors: function () {
      return UISelectors;
    },

    addListItem: function (item) {
      // Unhide the item list
      document.querySelector(UISelectors.itemList).style.display = "block";

      // Create li element
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name} : </strong> <em>${item.calories} calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;

      //   Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    addListItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },

    updateListItem: function (itemToUpdate) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      console.log(listItems);

      // Convert node list to an array

      listItems = Array.from(listItems);

      console.log(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${itemToUpdate.id}`) {
          console.log("item found");
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${itemToUpdate.name} : </strong> <em>${itemToUpdate.calories} calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn nodelist into array

      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },

    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
  };
})();

// App Controller

const AppCtrl = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Load Event Listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Disable submit on pressing Enter
    document.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        return false;
      }
    });

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    //   Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    //   Update item events
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    //   Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    //   Delete button event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Clear button event

    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  // Add item submit

  const itemAddSubmit = function (e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    if (input.name !== "" && input.calories !== "") {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
    }

    //   Add item to UI List
    UICtrl.addListItem(newItem);

    //   Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //   Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    //   Store in local storage
    StorageCtrl.storeItem(newItem);

    //   Clear input
    UICtrl.clearInput();

    e.preventDefault();
  };

  // Edit item click

  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      // Get the list item id
      const listItemID = e.target.parentNode.parentNode.id;

      // Break listItemID into an array
      const listIDArr = listItemID.split("-");

      const id = parseInt(listIDArr[1]);

      // Get item

      const itemToEdit = ItemCtrl.getItemByID(id);

      // Set current item

      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form

      UICtrl.addListItemToForm();
    }
    e.preventDefault();
  };

  // Item update Submit

  const itemUpdateSubmit = function (e) {
    const input = UICtrl.getItemInput();

    //   Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //   Update UI
    UICtrl.updateListItem(updatedItem);

    //   Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //   Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    //   Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete button event

  const itemDeleteSubmit = function (e) {
    //   Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete item from data structure
    ItemCtrl.deleteItem(currentItem.id);

    //   Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    //   Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //   Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    //   Delete from local storage
    StorageCtrl.delteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear items event

  const clearAllItemsClick = function () {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();
    //   Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //   Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    //   Remove from UI
    UICtrl.removeItems();

    StorageCtrl.clearAllFromStorage();

    //   Hide list
    UICtrl.hideList();
  };

  // Public Methods
  return {
    init: function () {
      //   Clear edit state
      UICtrl.clearEditState();

      //   Fetching items from data structure
      const items = ItemCtrl.getItems();

      //   Check if any items are there or not
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //   Populating list with items
        UICtrl.populateItemList(items);
      }

      //   Get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //   Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initializing App
AppCtrl.init();
