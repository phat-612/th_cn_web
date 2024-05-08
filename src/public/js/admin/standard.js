// handle delete form
$(".formDelete").on("submit", function (e) {
  e.preventDefault();
  const isDelete = confirm("Bạn có chắc chắn muốn xóa?");
  if (isDelete) {
    this.submit();
  }
});
// modal quản lý tiêu chuẩn
$("#standardModal").on("show.bs.modal", function (e) {
  const button = $(e.relatedTarget);
  const action = button.attr("data-bs-action");
  if (action === "add") {
    $("#standardModalLabel").text("Thêm tiêu chuẩn");
    $("#standardForm").attr("action", "/api/standard");
    $("#btnSubmitStandardForm").text("Thêm tiêu chuẩn");
    $("#standardForm").trigger("reset");
  } else {
    const idStandard = button.attr("data-bs-idStandard");
    const name = button.attr("data-bs-nameStandard");
    $("#standardModalLabel").text("Cập nhật tiêu chuẩn");
    $("#standardForm").attr(
      "action",
      `/api/standard?idStandard=${idStandard}&_method=PATCH`
    );
    $("#name").val(name);
    $("#btnSubmitStandardForm").text("Cập nhật tiêu chuẩn");
  }
});
// modal tiêu chí
$("#criteriaModal").on("show.bs.modal", function (e) {
  // clear form
  $("#areaInputCriteria").html("");
  $("#addInputCriteria").click();
  const button = $(e.relatedTarget);
  const action = button.attr("data-bs-action");
  if (action === "add") {
    $("#criteriaForm").trigger("reset");
    const idStandard = button.attr("data-bs-idStandard");
    const nameStandard = button.attr("data-bs-nameStandard");
    $("#addInputCriteria").show();
    $("#criteriaModalLabel").text("Thêm tiêu chí");
    $("#btnSubmitCriteriaForm").text("Thêm tiêu chí");
    $("#nameStandard").text(nameStandard);
    $("#criteriaForm").attr("action", "/api/criteria");
    $("#idStandard").val(idStandard);
  } else {
    const idCriteria = button.attr("data-bs-idCriteria");
    const name = button.attr("data-bs-name");
    const score = button.attr("data-bs-score");
    $("#addInputCriteria").hide();
    $("#criteriaModalLabel").text("Cập nhật tiêu chí");
    $("#btnSubmitCriteriaForm").text("Cập nhật tiêu chí");
    $("#criteriaForm").attr(
      "action",
      `/api/criteria?idCriteria=${idCriteria}&_method=PATCH`
    );
    $("#nameCriteria").val(name);
    $("#score").val(score);
  }
});
// btn thêm input tiêu chí
$("#addInputCriteria").on("click", function (e) {
  e.preventDefault();
  const countRow = $("#criteriaForm .row").length;
  let html = `
    <div class="row">
      <div class="col mb-2">
        <label for="nameCriteria" class="col-form-label">Tên tiêu chí</label>
        <input
          type="text"
          class="form-control"
          id="nameCriteria"
          name="criterias[${countRow}][name]"
          required
        />
      </div>
      <div class="col mb-2">
        <label for="score" class="col-form-label">Điểm</label>
        <input
          type="text"
          class="form-control"
          id="score"
          name="criterias[${countRow}][score]"
          required
        />
      </div>
      <div class="col-2 mb-2 align-content-end  text-center">
        <button type="button" class="btn btn-danger" onclick="deleteRowInput(event)">Xóa</button>
      </div>
    </div>
  `;
  $("#areaInputCriteria").append(html);
});

// function
function deleteRowInput(event) {
  $(event.target).closest(".row").remove();
}
