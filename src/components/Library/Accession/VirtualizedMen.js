import { FixedSizeList as List } from "react-window";
import { Checkbox, MenuItemOption, Text } from "@chakra-ui/react";
import React from "react";
import find from "lodash/find"; // Ensure lodash is imported

function VirtualizedMen({ data, inputValue, onSelect }) {
  const Row = ({ index, style }) => {
    const item = data[index];

    // Check if the item is checked
    const isChecked = find(inputValue?.catelogId, (ex) => ex === item.id);

    const handleSelect = (e) => {
      onSelect(item.id, e.target.checked); // Trigger the onSelect callback
    };

    return (
      <MenuItemOption
        key={item.id}
        value={item.id}
        style={{
          ...style,
          backgroundColor: isChecked ? "#D3E5FF" : "transparent", // Highlight selected item with a background color
          color: isChecked ? "#1A202C" : "#4A5568", // Change text color for selected items
          fontWeight: isChecked ? "bold" : "normal", // Make text bold for selected items
          padding: "8px", // Adjust padding if needed
        }}
      >
        <Checkbox
          isChecked={isChecked}
          onChange={handleSelect} // Handle checkbox change
          value={item.id}
        >
          <Text fontSize="15px">{item.name}</Text>
        </Checkbox>
      </MenuItemOption>
    );
  };

  return (
    <div style={{ overflow: "hidden", height: 200 }}>
      <List
        className="scrollBar"
        height={200} // Height of the visible area
        itemCount={data.length}
        itemSize={40} // Height of each item
        width={"30vw"} // Width of the list container
        // style={{
        //   overflowX: "hidden", // Prevent horizontal scrollbar
        //   overflowY: "auto", // Enable vertical scrolling inside hidden container
        // }}
      >
        {Row}
      </List>
    </div>
  );
}

export default VirtualizedMen;
