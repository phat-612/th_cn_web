// handle checkbox active
$("input[type='checkbox']").change(function (e) {
  const checkbox = $(e.target);
  checkbox.prop("disabled", true);
  const id = checkbox.val();
  const checked = checkbox.prop("checked");
  fetch(`/api/active?idUser=${id}&checked=${checked}&_method=PATCH`, {
    method: "POST",
  }).then((res) => {
    checkbox.prop("disabled", false);
  });
});
// handle select role
$("select").change(function (e) {
  const select = $(e.target);
  select.prop("disabled", true);
  const idUser = select.attr("data-bs-idUser");
  const role = select.val();
  fetch(`/api/role?idUser=${idUser}&role=${role}&_method=PATCH`, {
    method: "POST",
  }).then((res) => {
    select.prop("disabled", false);
  });
});
