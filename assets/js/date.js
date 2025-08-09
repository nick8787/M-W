$(function () {
  var from_$input = $(".date_from").pickadate();
  var from_picker = from_$input.pickadate("picker");

  if (from_picker) {
    if (from_picker.get("value")) {
      from_picker.set("max", from_picker.get("select"));
    }

    from_picker.on("set", function (event) {
      if (event.select) {
        from_picker.set("max", from_picker.get("select"));
      } else if ("clear" in event) {
        from_picker.set("max", false);
      }
    });
  }
});

$(".timepicker").timepicker({
  timeFormat: "h:mm p",
  interval: 30,
  minTime: "10:00am",
  maxTime: "6:00pm",
  defaultTime: "10:00am",
  startTime: "10:00am",
  dynamic: false,
  dropdown: true,
  scrollbar: true,
});
