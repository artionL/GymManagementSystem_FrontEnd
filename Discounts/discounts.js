$(document).ready(function () {
    const apiUrl = 'https://localhost:7209/api/Discounts';


    console.log("HELLO");

    function displayOutput(result) {
        let tableData = '';
        $('#message').html("<h1>Discounts List Retrieved Successfully</h1>");

        let message = `
            <table id="data-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Value</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                </thead>
                <tbody id="table-body"></tbody>
            </table>`;
        $('#output').html(message);
 
        result.forEach(discount => {
            tableData += `
                <tr>
                    <td style="display: none;">${discount.id}</td>
                    <td>${discount.code}</td>
                    <td>${discount.value}</td>
                    <td>${discount.startDate}</td>
                    <td>${discount.endDate}</td>
                    <td><button onClick="handleUpdate(${discount.id})">Update</button></td>
                    <td><button onClick="deleteDiscounts(${discount.id})">Delete</button></td>
                </tr>`;
        });

        $('#table-body').html(tableData);
    }

    window.handleUpdate = function (id) {
        console.log(`Button clicked for discount with ID: ${id}`);

        window.location.replace(`update_discounts.html?id=${id}`);
    }

    function handleApiError(error) {
        console.error('API error:', error);
        console.log(error);
        $('#output').html('Error occurred. Please check the console for details.');
    }

    function getDiscounts(){
        let filter = $('#input-filter').val();
       
        console.log("GetDiscounts");
        $.ajax({
            type: 'GET',
            url: `${apiUrl}/filter?filter=${filter}`,
            dataType: 'json',
            success: function(data) {
                console.log("GetDiscountsSuccess");
                displayOutput(data);
                console.log(data);
            },
            error: function(error) {
                console.log("GetDiscountsError")
                handleApiError(error);
            }
        });
    }

    $('#addDiscountsForm').on('submit', function(event) {
        event.preventDefault();
        const addedDiscountsData = {
            code: $('#codeAdd').val(),
            value: parseInt($('#valueAdd').val()),
            startDate: $('#startDateAdd').val(),
            endDate: $('#endDateAdd').val(),
        };
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(addedDiscountsData),
            success: function () {
                alert("Discount added successfully")
                window.location.replace(`discounts.html`);
            },
            error: function (error) {
                handleApiError(error);
            }
        });
    });

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
    const discountId = urlParams.get('id');
    
    if (discountId) {
        // Fetch the member data using the member ID
        
        $.ajax({
            url: `${apiUrl}/${discountId}`,
            method: 'GET',
            success: function(discount) {
                // Populate the form fields with the member's current data
                $('#idUpdate').val(discount.id);  // Set the ID value in the input field
                console.log(discount.id);
                $('#codeUpdate').val(discount.code);
                $('#valueUpdate').val(discount.value);
                $('#startDateUpdate').val(discount.startDate);
                $('#endDateUpdate').val(discount.endDate);
                $('#isActiveUpdate').val(discount.isActive);
                
                if (discount.startDate) {
                    const formattedStartDate = formatDateToYYYYMMDD(new Date(discount.startDate));
                    $('#startDateUpdate').val(formattedStartDate);
                }
                if (discount.endDate) {
                    const formattedEndDate = formatDateToYYYYMMDD(new Date(discount.endDate));
                    $('#endDateUpdate').val(formattedEndDate);
                }
            },
            error: function(error) {
                console.error("Error fetching member data:", error);
            }
        });
    }

    // Handle the form submission to update member data
    $('#updateDiscountsForm').on('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        console.log("UpdateTriggered");

        // Get the updated data from the form
        const updatedDiscountsData = {
            id: $('#idUpdate').val(),
            code: $('#codeUpdate').val(),
            value: $('#valueUpdate').val(),
            startDate: $('#startDateUpdate').val(),
            endDate: $('#endDateUpdate').val(),
        };
        debugger
        console.log("UpdatedDiscountDataTriggered");
        // Send the updated data to the server
        $.ajax({
            url: `${apiUrl}/${updatedDiscountsData.id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedDiscountsData),
            success: function() {
                alert("Discount updated successfully!");
                window.location.replace(`discounts.html`);
            },
            error: function(error) {
                console.error("Error updating discounts data:", error);
                alert("There was an error updating the discount.");
            }
        });
    });

    window.deleteDiscounts = function(discountId) {
        console.log(discountId);
        $.ajax({
            url: `${apiUrl}/${discountId}`,
            method: 'DELETE',
            success: function () {
                getDiscounts();
                alert(`Discount with ID ${discountId} deleted successfully.`);
            },
            error: function (error) {
                handleApiError(error);
            }
        });
    }

    function logMessage(){
        console.log("Test");
    }

    

    $('#getDiscountsBtn').on('click', getDiscounts);
    // $('#addMembersBtn').on('click', addMembers);
    // $('#updateMembersBtn').on('click', updateMember);
    // $('#deleteMembersBtn').on('click', deleteMember);
    //document.getElementById('getMembersBtn').addEventListener('click', console.log("Button Clicked") );
});