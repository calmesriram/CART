var baseurl = "https://cartbackendnode.herokuapp.com"
// var baseurl = "http://localhost:3000"
var filesToUpload = "";
var filesToUpload2 = "";
function select_file(e) {
	filesToUpload = e.target.files[0];
}
function select_file2(e) {
	filesToUpload2 = e.target.files[0];
}
function addproduct() {
	let payload = {
		pname: document.getElementById("pname").value,
		pqty: document.getElementById("pqty").value,
		prate: document.getElementById("prate").value
	}
	console.log(payload);
	const formData = new FormData();
	formData.append('pdata', JSON.stringify(payload))
	formData.append('file', filesToUpload);
	$.ajax({
		type: "POST",
		url: baseurl + "/addproduct",
		data: formData,
		processData: false,
		contentType: false,
		success: function (result) {
			if (result) {
				// console.log("product added sucessfully")
				alertify.notify(result.msg, 'success', 5)
				console.log(result);
				productcount();
			}
		}
	})
}
function displayusername() {
	setInterval(() => {
		document.getElementById("currentuser").innerText = sessionStorage.getItem("Name")
	}, 2000);
}

function register() {
	let name = document.getElementById("name").value;
	let email = document.getElementById("email").value;
	let pwd = document.getElementById("pwd").value;
	let add = document.getElementById("add").value;
	let payload = {
		name: name,
		email: email,
		password: pwd,
		address: add
	}
	$.ajax({
		url: baseurl + "/reg",
		method: "POST",
		headers: {
			'Cache-Control': null,
			'X-Requested-With': null,
		},
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(payload),
		success: function (result) {
			console.log("sucessfully register")
			// console.log(result);
			if (result.status == true) {
				alertify.notify(result.msg, 'success', 5, function () {
					console.log('dismissed');
					setTimeout(() => {
						window.location.href = "./newlogin.html"
					}, 2000)
				});

			}
			// here do the validation 
		}
	});
}

function login() {
	let name = document.getElementById("lname").value;
	let pwd = document.getElementById("lpwd").value;
	let payload = {
		Name: name,
		Pwd: pwd
	}
	$.ajax({
		url: baseurl + "/login",
		method: "POST",
		headers: {
			'Cache-Control': null,
			'X-Requested-With': null,
		},
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(payload),
		success: function (result) {
			console.log("sucessfully login")
			console.log(result);
			if (result.status == true) {
				if (result.Data.length == 0) {
					alert("Check Your Credencials");
					return;
				}
				if (result.Data.length != 0) {
					if (result.Data[0].Role == "admin") {

						alertify.notify('login success', 'success', 5, function () {
							sessionStorage.setItem("Userid", result.Data[0].Userid)
							sessionStorage.setItem("Name", result.Data[0].Name)
							sessionStorage.setItem("Role", result.Data[0].Role)
							setTimeout(() => {
								window.location.href = "./index1.html"
							}, 2000)

						});
					} else {
						alert("user")
					}
				}

			}
			// here do the validation 
		}
	});
}
function usercount() {
	setInterval(() => {
		$.ajax({
			url: baseurl + "/totaluser",
			method: "GET",
			success: function (result) {
				if (result.status == true) {
					document.getElementById("usercount").innerText = result.Data.length + -1;
				}
				// here displays the time 
			}
		});
	}, 2000)
}

function updateprod() {
	let payload = {
		pname: document.getElementById("upname").value,
		pqty: document.getElementById("upqty").value,
		prate: document.getElementById("uprate").value
	}
	const formData = new FormData();
	formData.append('pdata', JSON.stringify(payload))
	formData.append('file', filesToUpload2);
	console.log(payload)

	$.ajax({
		url: baseurl + "/updproduct/" + document.getElementById("upid").value,
		method: "PUT",
		headers: {
			'Cache-Control': null,
			'X-Requested-With': null,
		},
		processData: false,
		contentType: false,
		data: formData,
		success: function (result) {
			console.log("product added sucessfully")
			alertify.notify(result.msg, 'success', 5)
			console.log(result);
			productcount();
		}
	});

}
function productcount() {
	$("#prdbody").html('');
	$("#prdbody2").html('');
	var test;
	$.ajax({
		url: baseurl + "/allproduct",
		method: "GET",
		success: function (result) {
			if (result.status == true) {
				result.Data.forEach(element => {
					console.log(element)
					if (element.Pimg) {						
						element.Pimg = baseurl+'/media/'+element.Pimg;						
						test = "<img src='"+element.Pimg+"' alt='"+element.Pimg+"' class='rounded'  width='25' height='23' />";						
						$("#prdbody").
							append('<tr><td>' + element.Pid + '</td><td>'
								+ element.Pname + '</td><td>'
								+ element.Prate + '</td><td>'
								+ element.Pqty + '</td>' +
								'<td><button class="btn btn-danger"  value=' + element.Pid + ' onclick="mydeleteproduct(this);"> DEL </button></td><td>'+test+'</td></tr>');

						$("#prdbody2").
							append('<tr><td>'
								+ element.Pname + '</td><td>'
								+ element.Prate + '</td><td>'
								+ element.Pqty + '</td><td>'+test+'</td></tr>');
					}
				});

			}
			// here displays the time 
		}
	});
}
function mydeleteproduct(i) {
	$.ajax({
		url: baseurl + "/delproduct/" + i.value,
		method: "DELETE",
		headers: {
			'Cache-Control': null,
			'X-Requested-With': null,
		},
		dataType: 'json',
		contentType: 'application/json',
		success: function (result) {
			if (result.status == true) {
				productcount();
				alertify.notify(result.Msg, 'success', 5, function () { })

			}
			// here do the validation 
		}
	});
}
function totaluserlist() {
	$("#userbody").html('');
	$.ajax({
		url: baseurl + "/totaluser",
		method: "GET",
		success: function (result) {
			if (result.status == true) {
				result.Data.forEach(element => {
					if (element.Role == "User") {

						$("#userbody").
							append('<tr><td>' + element.Name + '</td><td>'
								+ element.Email + '</td><td>'
								+ element.Address + '</td></tr>');

					}
				});
			}

		}
	});
}
function logout() {
	sessionStorage.clear();
	window.location.href = "./index.html"
}