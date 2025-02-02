$(document).ready(function () {
    const apiUrl = 'https://localhost:7209/api/Members';


    console.log("HELLO");

    function displayOutput1(result){
        let message;
        let tableData;


    }

    function displayOutput(result) {
        let tableData = '';
        $('#message').html("<h1>Members List Retrieved Successfully</h1>");

        let message = `
            <table id="data-table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Birthday</th>
                        <th>ID Card Number</th>
                        <th>Email</th>
                        <th>Registration Date</th>
                    </tr>
                </thead>
                <tbody id="table-body"></tbody>
            </table>`;
        $('#output').html(message);

        result.forEach(member => {
            tableData += `
                <tr>
                    <td style="display: none;">${member.id}</td>
                    <td>${member.firstName}</td>
                    <td>${member.lastName}</td>
                    <td>${member.birthday}</td>
                    <td>${member.idCardNumber}</td>
                    <td>${member.email}</td>
                    <td>${member.registrationDate}</td>
                    <td><button onClick="handleUpdate(${member.id})">Update</button></td>
                    <td><button onClick="deleteMembers(${member.id})">Delete</button></td>
                </tr>`;
        });

        $('#table-body').html(tableData);
    }

    window.handleUpdate = function (id) {
        console.log(`Button clicked for member with ID: ${id}`);

        window.location.replace(`update_member.html?id=${id}`);
    }

    function handleApiError(error) {
        console.error('API error:', error);
        console.log(error);
        $('#output').html('Error occurred. Please check the console for details.');
    }

    function getMembers(){
        let filter = $('#input-filter').val();
       
        console.log("GetMembers");
        $.ajax({
            type: 'GET',
            url: `${apiUrl}/filter?filter=${filter}`,
            dataType: 'json',
            success: function(data) {
                console.log("GetMembersSuccess");
                displayOutput(data);
                console.log(data);
            },
            error: function(error) {
                console.log("GetMembersError")
                handleApiError(error);
            }
        });
    }

    $('#addMemberForm').on('submit', function(event) {
        event.preventDefault();
        const addedMemberData = {
            firstName: $('#firstNameAdd').val(),
            lastName: $('#lastNameAdd').val(),
            idCardNumber: $('#idCardNumberAdd').val(),
            email: $('#emailAdd').val(),
            registrationDate: $('#registrationDateAdd').val(),
            //birthday: new Date($('#birthdayCreate').val()).toISOString(),
            birthday: ($('#birthdayAdd').val()) ? new Date($('#birthdayAdd').val()).toISOString() : null,
            //birthday: $('#birthdayCreate').toISOString.val(), //
            //$('#isDeletedCreate').val()
        };
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(addedMemberData),
            success: function () {
                alert("Member added successfully")
                window.location.replace(`members.html`);
            },
            error: function (error) {
                handleApiError(error);
            }
        });
    });
    

    // function addMember() {
    //     const membersData = {
    //         firstName: $('#firstNameAdd').val(),
    //         lastName: $('#lastNameAdd').val(),
    //         idCardNumber: $('#idCardNumberAdd').val(),
    //         email: $('#emailAdd').val(),
    //         registrationDate: $('#registrationDateAdd').val(),
    //         //birthday: new Date($('#birthdayCreate').val()).toISOString(),
    //         birthday: ($('#birthdayAdd').val()) ? new Date($('#birthdayAdd').val()).toISOString() : null,
    //         //birthday: $('#birthdayCreate').toISOString.val(), //
            
    //         //$('#isDeletedCreate').val()
    //     };
    //     $.ajax({
    //         url: apiUrl,
    //         method: 'POST',
    //         contentType: 'application/json',
    //         data: JSON.stringify(membersData),
    //         success: function () {
    //             window.location.replace(`members.html`);
    //             getMembers();
    //             displayOutput('Member added successfully.');
    //         },
    //         error: function (error) {
    //             handleApiError(error);
    //         }
    //     });
    // }

    function formatDateToYYYYMMDD(date) {
        const year = date.getFullYear(); // Get the year (YYYY)
        const month = date.getMonth() + 1; // Get month (0-11), add 1 to make it (1-12)
        const day = date.getDate(); // Get day (1-31)
    
        // Ensure month and day are always two digits (e.g., 03, 09, 12)
        const formattedMonth = month < 10 ? '0' + month : month;
        const formattedDay = day < 10 ? '0' + day : day;
    
        return `${year}-${formattedMonth}-${formattedDay}`;
    }

    
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = urlParams.get('id');
    
    if (memberId) {
        // Fetch the member data using the member ID
        $.ajax({
            url: `${apiUrl}/${memberId}`,
            method: 'GET',
            success: function(member) {
                // Populate the form fields with the member's current data
                $('#idUpdate').val(member.id);  // Set the ID value in the input field
                $('#firstNameUpdate').val(member.firstName);
                $('#lastNameUpdate').val(member.lastName);
                $('#idCardNumberUpdate').val(member.idCardNumber);
                $('#emailUpdate').val(member.email);
                //$('#registrationDateUpdate').val(member.registrationDate ? new Date(member.registrationDate).toISOString.split('T')[0] : '');
                //$('#birthdayUpdate').val(member.birthday ? new Date(member.birthday).toISOString().split('T')[0] : ''); // Format to yyyy-mm-dd
                if (member.registrationDate) {
                    const formattedRegistrationDate = formatDateToYYYYMMDD(new Date(member.registrationDate));
                    $('#registrationDateUpdate').val(formattedRegistrationDate);
                }
                if (member.birthday) {
                    const formattedBirthday = formatDateToYYYYMMDD(new Date(member.birthday));
                    $('#birthdayUpdate').val(formattedBirthday);
                }
            },
            error: function(error) {
                console.error("Error fetching member data:", error);
            }
        });
    }

    // Handle the form submission to update member data
    $('#updateMemberForm').on('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get the updated data from the form
        const updatedMemberData = {
            id: $('#idUpdate').val(),
            firstName: $('#firstNameUpdate').val(),
            lastName: $('#lastNameUpdate').val(),
            idCardNumber: $('#idCardNumberUpdate').val(),
            email: $('#emailUpdate').val(),
            registrationDate: $('#registrationDateUpdate').val(),
            birthday: $('#birthdayUpdate').val() ? new Date($('#birthdayUpdate').val()).toISOString() : null,
        };

        // Send the updated data to the server
        $.ajax({
            url: `${apiUrl}/${updatedMemberData.id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedMemberData),
            success: function() {
                alert("Member updated successfully!");
                window.location.replace(`members.html`);
            },
            error: function(error) {
                console.error("Error updating member data:", error);
                alert("There was an error updating the member.");
            }
        });
    });

    window.deleteMembers = function(membersId) {
        console.log(membersId);
        $.ajax({
            url: `${apiUrl}/${membersId}`,
            method: 'DELETE',
            success: function () {
                getMembers();
                alert(`Member with ID ${membersId} deleted successfully.`);
            },
            error: function (error) {
                handleApiError(error);
            }
        });
    }

    function logMessage(){
        console.log("Test");
    }

    

    $('#getMembersBtn').on('click', getMembers);
    // $('#addMembersBtn').on('click', addMembers);
    // $('#updateMembersBtn').on('click', updateMember);
    // $('#deleteMembersBtn').on('click', deleteMember);
    //document.getElementById('getMembersBtn').addEventListener('click', console.log("Button Clicked") );
});