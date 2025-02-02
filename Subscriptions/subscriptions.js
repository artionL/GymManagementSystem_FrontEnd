$(document).ready(function () {
    const apiUrl = 'https://localhost:7209/api/Subscriptions';
    function handleApiError(error) {
        console.error('API error:', error);
        //displayOutput('Error occurred. Please check the console for details.');
    }
    console.log("HELLO");
    function displayOutput(result){
        let tableData = '';
        $('#message').html("<h3>Subscriptions retrieved successfully:</h3>");
        let message=`
        <table id="data-table" class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Description</th>
                    <th>NumberOfMonths</th>
                    <th>WeekFrequency</th>
                    <th>TotalNumberOfSessions</th>
                    <th>TotalPrice</th>
                    <th>IsDeleted</th>
                </tr>
            </thead>
            <tbody id="table-body"></tbody>
            </table>`;
        $('#output').html(message);
        result.forEach(subscriptions => {
            tableData += `
                <tr>
                    <td>${subscriptions.id}</td>
                    <td>${subscriptions.code}</td>
                    <td>${subscriptions.description}</td>
                    <td>${subscriptions.numOfMonths}</td>
                    <td>${subscriptions.weekFrequency}</td>
                    <td>${subscriptions.totalNumSessions}</td>
                    <td>${subscriptions.totalPrice}</td>
                    <td>${subscriptions.isDeleted}</td>
                    <td><button onClick="handleUpdate(${subscriptions.id})">Update</button></td>
                    <td><button onClick="deleteSubscription(${subscriptions.id})">Delete</button></td>
                </tr>`;
        });
        $('#table-body').html(tableData);
    }

    window.handleUpdate = function (id) {
        console.log(`Button clicked for subscription with ID: ${id}`);

        window.location.replace(`update_subscriptions.html?id=${id}`);
    }

    function handleApiError(error) {
        console.error('API error:', error);
        console.log(error);
        $('#output').html('Error occurred. Please check the console for details.');
    }

    function getSubscriptions(){
        let filter = $('#input-filter').val();
        console.log("GetSubscriptions");
        $.ajax({
            type: 'GET',
            url: `${apiUrl}/filter?filter=${filter}`,
            dataType: 'json',
            success: function(data) {
                console.log("GetSubscriptionsSuccess");
                displayOutput(data);
                console.log(data);
            },
            error: function(error) {
                console.log("GetSubscriptionsError")
                handleApiError(error);
            }
        });
    }

    $('#addSubscriptionForm').on('submit', function(event) {
        event.preventDefault();
        const addedSubscriptionData = {
            code: $('#codeAdd').val(),
            description: $('#descriptionAdd').val(),
            numOfMonths: parseInt($('#numberOfMonthsAdd').val()),
            weekFrequency: parseInt($('#weekFrequencyAdd').val()),
            totalNumSessions: parseInt($('#totalNumberOfSessionsAdd').val()),
            totalPrice : parseFloat($('#totalPriceAdd').val()),
            //isDeleted: $('#isDeletedAdd').prop('checked')
            //$('#isDeletedCreate').val()
        };
        
        let nn = JSON.stringify(addedSubscriptionData);
        console.log(nn);
        debugger;
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(addedSubscriptionData),
            success: function () {
                alert("Subscription added successfully!");
                window.location.replace (`subscriptions.html`);
            },
            error: function (error) {
                handleApiError(error);
            }
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionId = urlParams.get('id');

    if (subscriptionId) {
        // Fetch the subscription data using the subscription ID
        $.ajax({
            url: `${apiUrl}/${subscriptionId}`,
            method: 'GET',
            success: function (subscription) {
                // Populate the form fields with the subscription's current data
                $('#idUpdate').val(subscription.id);  // Set the ID value in the input field
                $('#codeUpdate').val(subscription.code);
                $('#descriptionUpdate').val(subscription.description);
                $('#numberOfMonthsUpdate').val(subscription.numOfMonths);
                $('#weekFrequencyUpdate').val(subscription.weekFrequency);
                $('#totalNumSessionsUpdate').val(subscription.totalNumSessions);
                $('#totalPriceUpdate').val(subscription.totalPrice);
                $('#isDeletedUpdate').prop('checked', subscription.isDeleted);
            },
            error: function (error) {
                console.error("Error fetching subscription data:", error);
            }
        });
    }
    // Handle the form submission to update subscription data
    $('#updateSubscriptionForm').on('submit', function (event) {
        event.preventDefault(); // Prevent default form submission
        debugger;
        // Get the updated data from the form
        const updatedSubscriptionData = {
            id: $('#idUpdate').val(),
            code: $('#codeUpdate').val(),
            description: $('#descriptionUpdate').val(),
            numOfMonths: parseInt($('#numberOfMonthsUpdate').val()),
            weekFrequency: parseInt($('#weekFrequencyUpdate').val()),
            totalNumSessions: parseInt($('#totalNumSessionsUpdate').val()),
            totalPrice: parseFloat($('#totalPriceUpdate').val()),
            // isDeleted: $('#isDeletedUpdate').prop('checked'),
        };
        // Send the updated data to the server
        $.ajax({
            url: `${apiUrl}/${updatedSubscriptionData.id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedSubscriptionData),
            success: function () {
                alert("Subscription updated successfully!");
                window.location.replace(`subscriptions.html`);
            },
            error: function (error) {
                console.error("Error updating subscription data:", error);
                alert("There was an error updating the subscription.");
            }
        });
    });

    
    // $('#updateSubscriptionForm').on('submit', function(event) {
    //     event.preventDefault(); // Prevent default form submission
    //     // Get the updated data from the form
    //     const updatedSubscriptionData = {
    //         id: $('#idUpdate').val(),
    //         code: $('#codeUpdate').val(),
    //         description: $('#descriptionUpdate').val(),
    //         numberOfMonths: parseInt($('#numberOfMonthsUpdate').val()),
    //         weekFrequency: parseInt($('#weekFrequencyUpdate').val()),
    //         totalNumberOfSessions: parseInt($('#totalNumberOfSessionsUpdate').val()),
    //         totalPrice : parseFloat($('#totalPriceUpdate').val()),
    //         isDeleted: $('#isDeletedUpdate').prop('checked')
    //     };
    //     // Send the updated data to the server
    //     $.ajax({
    //         url: `${apiUrl}/${updatedSubscritpionData.id}`,
    //         method: 'PUT',
    //         contentType: 'application/json',
    //         data: JSON.stringify(updatedSubscriptionData),
    //         success: function() {
    //             alert("Subscription updated successfully!");
    //             window.location.replace(`subscriptions.html`);
    //         },
    //         error: function(error) {
    //             console.error("Error updating member data:", error);
    //             alert("There was an error updating the member.");
    //         }
    //     });
    // });

    
    
       window.deleteSubscription= function(subscriptionId) {
            console.log(subscriptionId);
            $.ajax({
                url: `${apiUrl}/${subscriptionId}`,
                method: 'DELETE',
                success: function () {
                    getSubscriptions();
                    alert("Subscription deleted successfully!");
                },
                error: function (error) {
                    handleApiError(error);
                }
            });
        }

        $('#getSubscriptionsBtn').on('click', getSubscriptions);
    });