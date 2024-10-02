import "./App.css";
import WeekdayDateRangePicker from "./components/WeekdayDateRangePicker";

function App() {
  const handleDateChange = (range: [string[], string[]]) => {
    console.log("Selected Range:", range);
  };

  return (
    <div className="App">
      <WeekdayDateRangePicker onChange={handleDateChange} />
    </div>
  );
}

export default App;
