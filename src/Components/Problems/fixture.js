export const getColumnSearchProps = (dataIndex) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={(node) => {
          this.searchInput = node;
        }}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            confirm({ closeDropdown: false });
            this.setState({
              searchText: selectedKeys[0],
              searchedColumn: dataIndex,
            });
          }}
        >
          Filter
        </Button>
      </Space>
    </div>
  ),
});

export const columns = [
  {
    title: "Status",
    dataIndex: "status",
    width: "5%",
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: {
      compare: (a, b) => a.title - b.title,
      multiple: 3,
    },
    ...getColumnSearchProps("name"),
  },
  {
    title: "Note",
    dataIndex: "note",
    width: "5%",
    // sorter: {
    //   compare: (a, b) => a.note - b.note,
    //   multiple: 2,
    // },
  },
  {
    title: "Difficulty",
    dataIndex: "difficulty",
    sorter: {
      compare: (a, b) => a.difficulty - b.difficulty,
      multiple: 1,
    },
    width: "10%",
    filters: [
      { text: "Easy", value: "easy" },
      { text: "Medium", value: "medium" },
      { text: "Hard", value: "hard" },
    ],
  },
];
