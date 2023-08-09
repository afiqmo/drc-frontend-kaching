import * as React from "react";

import {
  LinearProgress,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
  makeStyles,
} from "@material-ui/core";
import { doc, setDoc } from "firebase/firestore";

import Box from "@mui/material/Box";
import { CryptoState } from "../CryptoContext";
import FavouriteIcon from "../asset/favourite.png";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import Service from "../service/Service";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import UnFavouriteIcon from "../asset/unfav-icon.png";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { visuallyHidden } from "@mui/utils";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Coin Name",
  },
  {
    id: "current_price",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "price_change_percentage_24h",
    numeric: true,
    disablePadding: false,
    label: "24H Change",
  },
  {
    id: "market_cap",
    numeric: true,
    disablePadding: false,
    label: "Market Cap",
  },
  {
    id: "in_watchlist",
    numeric: true,
    disablePadding: false,
    label: <img src={FavouriteIcon} height={30} />,
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ backgroundColor: "#FFE227", color: "black" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable({ coins }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(coins?.length);

  const { symbol, watchlist, setAlert, user, setOpen } = CryptoState();

  const addToWatchList = async (usercoin) => {
    const coinRef = await doc(db, "watchlist", user.uid);

    try {
      await setDoc(coinRef, {
        coins: watchlist
          ? [...watchlist, { id: usercoin.id, holding: 1 }]
          : [{ id: usercoin.id, holding: 1 }],
      });

      setAlert({
        open: true,
        message: `${usercoin.name} Added to your portfolio`,
        type: "success",
      });
    } catch (error) {}
  };

  const removeFromWatchlist = async (usercoin) => {
    const coinRef = await doc(db, "watchlist", user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch.id !== usercoin?.id),
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        message: `${usercoin.name} Removed from your portfolio`,
        type: "success",
      });
    } catch (error) {}
  };

  React.useEffect(() => {
    coins.map((v) =>
      watchlist?.includes(watchlist.find((e) => e.id === v.id))
        ? (v.in_watchlist = true)
        : (v.in_watchlist = false)
    );
  }, [watchlist]);

  const navigate = useNavigate();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleClick = () => {};
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };
  const handleOpen = () => setOpen(true);

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - coins.length) : 0;

  React.useEffect(() => {
    setRowsPerPage(coins?.length);
  }, [coins]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{ width: "100%", mb: 2 }}
        style={{
          backgroundColor: "rgba(79, 58, 84, 0.52)",
          borderRadius: "15px",
        }}
      >
        <Paper elevation={7} />
        <TableContainer
          sx={{ maxHeight: 640 }}
          style={{ borderRadius: "15px" }}
        >
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            stickyHeader
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={coins.length}
            />

            <TableBody>
              {stableSort(coins, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const inWatchlist = watchlist?.includes(
                    watchlist.find((e) => e.id === row?.id)
                  );

                  return (
                    <TableRow
                      hover
                      onClick={() => handleClick()}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/coins/${row.id}`)}
                      >
                        <img
                          src={row.image}
                          height="25"
                          style={{ marginRight: "15px" }}
                        />
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <Typography variant="h6" style={{ color: "white" }}>
                            {row.symbol.toUpperCase()}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            style={{ color: "white" }}
                          >
                            {row.name}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell align="right" style={{ color: "white" }}>
                        {symbol}
                        {row.current_price > 1
                          ? Service.addCommas(row.current_price)
                          : row.current_price}{" "}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={
                          Service.isProfit(row.price_change_percentage_24h)
                            ? { color: "#33FF00" }
                            : { color: "#FF0000" }
                        }
                      >
                        {Service.isProfit(row.price_change_percentage_24h)
                          ? "+"
                          : ""}
                        {parseFloat(row.price_change_percentage_24h).toFixed(2)}
                        {"%"}
                      </TableCell>
                      <TableCell align="right" style={{ color: "white" }}>
                        {symbol}
                        {Service.addCommas(row.market_cap).slice(0, -8)}
                        {" Million"}
                      </TableCell>
                      <TableCell align="right">
                        {user ? (
                          inWatchlist ? (
                            <Tooltip title="Removed from portfolio">
                              <img
                                src={FavouriteIcon}
                                height="30rem"
                                onClick={() => {
                                  inWatchlist
                                    ? removeFromWatchlist(row)
                                    : addToWatchList(row);
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Add to portfolio">
                              <img
                                src={UnFavouriteIcon}
                                height="30rem"
                                onClick={() => {
                                  inWatchlist
                                    ? removeFromWatchlist(row)
                                    : addToWatchList(row);
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          )
                        ) : (
                          <img
                            src={UnFavouriteIcon}
                            height="30rem"
                            onClick={() =>
                              setAlert({
                                open: true,
                                message: `Please login to add coins to portfolio`,
                                type: "error",
                              })
                            }
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
