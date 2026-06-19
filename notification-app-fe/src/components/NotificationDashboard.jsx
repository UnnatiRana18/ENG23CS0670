import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid2 as Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Chip,
  Badge,
  CircularProgress,
  Alert,
  Box,
  Pagination,
  Tabs,
  Tab
} from "@mui/material";
import { logEvent } from "../services/logger";

const TYPE_WEIGHTS = {
  "Placement": 3,
  "Result": 2,
  "Event": 1
};

export default function NotificationDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewTab, setViewTab] = useState(0);
  const [typeFilter, setTypeFilter] = useState("All");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem("read_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    await logEvent("info", `Requesting notifications - Page: ${page}, Limit: ${limit}`);

    try {
      const response = await fetch(`http://4.224.186.213/evaluation-service/notifications?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "email": "ranaunnati223@gmail.com"
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned status code ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
      await logEvent("info", "Successfully parsed notification list data stream");
    } catch (err) {
      setError(err.message);
      await logEvent("error", `Network fetching fault: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      localStorage.setItem("read_notifications", JSON.stringify(updated));
      await logEvent("info", `Tracked user read view interaction on item: ${id}`);
    }
  };

  const getProcessedItems = () => {
    let items = [...notifications];

    if (typeFilter !== "All") {
      items = items.filter(n => n.Type === typeFilter);
    }

    if (viewTab === 1) {
      items = items.sort((a, b) => {
        const weightA = TYPE_WEIGHTS[a.Type] || 0;
        const weightB = TYPE_WEIGHTS[b.Type] || 0;
        if (weightB !== weightA) return weightB - weightA;
        return new Date(b.Timestamp) - new Date(a.Timestamp);
      });
    }

    return items;
  };

  const processedList = getProcessedItems();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Campus Notification Hub
        </Typography>
        <Badge badgeContent={notifications.filter(n => !readIds.includes(n.ID)).length} color="error">
          <Chip label="Unread Updates" variant="contained" color="secondary" />
        </Badge>
      </Box>

      <Tabs value={viewTab} onChange={(e, val) => setViewTab(val)} sx={{ mb: 3 }} centered>
        <Tab label="All Notifications Stream" />
        <Tab label="Priority Inbox Perspective" />
      </Tabs>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 4 }} alignItems="center">
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Category Filter</InputLabel>
            <Select value={typeFilter} label="Category Filter" onChange={(e) => setTypeFilter(e.target.value)}>
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Placement">Placements Only</MenuItem>
              <MenuItem value="Result">Results Only</MenuItem>
              <MenuItem value="Event">Events Only</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Items Per Fetch (n)</InputLabel>
            <Select value={limit} label="Items Per Fetch (n)" onChange={(e) => { setLimit(e.target.value); setPage(1); }}>
              <MenuItem value={5}>Top 5 Items</MenuItem>
              <MenuItem value={10}>Top 10 Items</MenuItem>
              <MenuItem value={15}>Top 15 Items</MenuItem>
              <MenuItem value={20}>Top 20 Items</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Button fullWidth variant="contained" onClick={fetchData} disabled={loading}>
            Refresh Feeds
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" my={5}><CircularProgress /></Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {processedList.length === 0 ? (
            <Typography variant="body1" textAlign="center" color="text.secondary" my={4}>
              No notifications matching your selections.
            </Typography>
          ) : (
            processedList.map((n) => {
              const isRead = readIds.includes(n.ID);
              return (
                <Card 
                  key={n.ID} 
                  variant="outlined"
                  onClick={() => markAsRead(n.ID)}
                  sx={{ 
                    cursor: "pointer",
                    transition: "0.2s",
                    borderColor: isRead ? "divider" : "primary.light",
                    borderLeftWidth: isRead ? 1 : 5,
                    backgroundColor: isRead ? "background.paper" : "action.hover",
                    "&:hover": { boxShadow: 2 }
                  }}
                >
                  <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Chip 
                        size="small" 
                        label={n.Type} 
                        color={n.Type === "Placement" ? "error" : n.Type === "Result" ? "warning" : "info"}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(n.Timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: isRead ? "normal" : "bold" }}>
                      {n.Message}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      )}

      <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
        <Pagination count={10} page={page} onChange={(e, v) => setPage(v)} color="primary" />
      </Box>
    </Container>
  );
}