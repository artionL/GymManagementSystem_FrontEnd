$(document).ready(function () {
    const apiUrl = 'https://localhost:7209/api/Member_Subscriptions';


    console.log("HELLO");

    function displayOutput1(result){
        let message;
        let tableData;

    }

    function displayOutput(result) {
        let tableData = '';
        $('#message').html("<h1>Subscribers List Retrieved Successfully</h1>");

        let message = `
            <table id="data-table">
                <thead>
                    <tr>
                        <th>Members' ID</th>
                        <th>Subscriptions' ID</th>
                        <th>Original Price</th>
                        <th>Discount Value</th>
                        <th>Paid Price</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Remaining Sessions</th>                       
                    </tr>
                </thead>
                <tbody id="table-body"></tbody>
            </table>`;
        $('#output').html(message);

        result.forEach(member_Subscriptions => {
            tableData += `
                <tr>
                    <td style="display: none;">${member_Subscriptions.id}</td>
                    <td>${member_Subscriptions.membersId}</td>
                    <td>${member_Subscriptions.subscriptionsId}</td>
                    <td>${member_Subscriptions.originalPrice}</td>
                    <td>${member_Subscriptions.discountValue}</td>
                    <td>${member_Subscriptions.paidPrice}</td>
                    <td>${member_Subscriptions.startDate}</td>
                    <td>${member_Subscriptions.endDate}</td>
                    <td>${member_Subscriptions.remainingSessions}</td>                    
                    <td><button onClick="handleUpdate(${member_Subscriptions.id})">Update</button></td>
                    <td><button onClick="deleteSubscriber(${member_Subscriptions.id})">Delete</button></td>
                </tr>`;
        });

        $('#table-body').html(tableData);
    }

    window.handleUpdate = function (id) {
        console.log(`Button clicked for subscriber with ID: ${id}`);

        window.location.replace(`update_memberSubscriptions.html?id=${id}`);
    }

    function handleApiError(error) {
        console.error('API error:', error);
        console.log(error);
        $('#output').html('Error occurred. Please check the console for details.');
    }

    function getSubscribers(){

        let filter = parseInt($('#input-filter').val());
        let lastUrl = "";
        if(isNaN(filter)){ lastUrl = "IdFilter";}
        else{lastUrl = "IdFilter?IdFilter="+ filter;}

        console.log(lastUrl);

        $.ajax({
            type: 'GET',
            url: `${apiUrl}/${lastUrl}`,
            dataType: 'json',
            success: function(data) {
                console.log("GetSubscribersSuccess");
                displayOutput(data);
                console.log(data);
            },
            error: function(error) {
                console.log("GetSuscribersError")
                handleApiError(error);
            }
        });
    }

    window.callDropDownsAPI = function(){

        let membersAPIUrl = "https://localhost:7209/api/Member_Subscriptions/GetAvailableMembers";
       

        $.ajax({
            type: 'GET',
            url: `${membersAPIUrl}`,
            dataType: 'json',
            success: function(data) {
                console.log("Available members Worked");
                let dropDownData = '';
                data.forEach(members =>{
                    dropDownData+=`
                    <option value=${members.id}>${members.idCardNumber}</option>
                    `;
                });

                $('#membersIdCardAdd').html(dropDownData);
                console.log(data);
            },
            error: function(error) {
                console.log("GetSuscribersError")
                handleApiError(error);
            }
        });

        let subscribersAPIURL = "https://localhost:7209/api/Subscriptions/filter";

        $.ajax({
            type: 'GET',
            url: `${subscribersAPIURL}`,
            dataType: 'json',
            success: function(data) {
                console.log("Available subscriptions Worked");
                let dropDownData = '';
                data.forEach(subscriptions =>{
                    dropDownData+=`
                    <option value=${subscriptions.id}>${subscriptions.code}</option>
                    `;
                });

                $('#subscriptionsCodeAdd').html(dropDownData);
                console.log(data);
            },
            error: function(error) {
                console.log("GetSubcribersError")
                handleApiError(error);
            }
        });

        let discountsAPIURL = "https://localhost:7209/api/Discounts/filter";

        $.ajax({
            type: 'GET',
            url: `${discountsAPIURL}`,
            dataType: 'json',
            success: function(data) {
                console.log("Available discounts Worked");
                let dropDownData = '';
                data.forEach(discounts =>{
                    dropDownData+=`
                    <option value=${discounts.id}>${discounts.value}</option>
                    `;
                });

                $('#discountValueAdd').html(dropDownData);
                console.log(data);
            },
            error: function(error) {
                console.log("GetDiscountsError")
                handleApiError(error);
            }
        });


    }
   
    $('#addSubscriberForm').on('submit', function(event) {
        event.preventDefault();
        debugger
        const addedSubscriptionData = {
            membersId: $('#membersIdCardAdd').val(),
            subscriptionsId: parseInt($('#subscriptionsCodeAdd').val()),
            originalPrice: parseFloat($('#originalPriceAdd').val()),
            discountValue: parseFloat($('#discountValueAdd').val()),
            paidPrice: parseFloat($('#paidPriceAdd').val()),
            //birthday: new Date($('#birthdayCreate').val()).toISOString(),
            startDate: ($('#startDateAdd').val()) ? new Date($('#startDateAdd').val()).toISOString() : null,
            endDate: ($('#endDateAdd').val()) ? new Date($('#endDateAdd').val()).toISOString() : null,
            remainingSessions: parseInt($('#remainingSessionsAdd').val()),

            //birthday: $('#birthdayCreate').toISOString.val(), //
            //$('#isDeletedCreate').val()
        };
        
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(addedSubscriptionData),
            success: function () {
                alert("Subscriber added successfully")
                window.location.replace(`memberSubscriptions.html`);
            },
            error: function (error) {
                handleApiError(error);
            }
        });
    });

    // function addSubscriber() {
    //     const subscriberData = {
    //         membersId: $('#membersIdCardAdd').val(),
    //         firstName: $('#firstNameAdd').val(),
    //         firstName: $('#firstNameAdd').val(),
    //         firstName: $('#firstNameAdd').val(),
    //         firstName: $('#firstNameAdd').val(),
    //         firstName: $('#firstNameAdd').val(),
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


    window.deleteSubscriber = function(member_SubscriptionsId) {
        console.log(member_SubscriptionsId);
        $.ajax({
            url: `${apiUrl}/${member_SubscriptionsId}`,
            method: 'DELETE',
            success: function () {
                getSubscribers();
                alert(`Subscriber with ID ${member_SubscriptionsId} deleted successfully.`);
            },
            error: function (error) {
                handleApiError(error);
            }
        });
    }

    function logMessage(){
        console.log("Test");
    }

    

    $('#getSubscribersBtn').on('click', getSubscribers);
    $('#registerSubscriberLink').on('click', callDropDownsAPI);
    window.onload = (event) => {
        callDropDownsAPI();
      };
    // $('#addMembersBtn').on('click', addMembers);
    // $('#updateMembersBtn').on('click', updateMember);
    // $('#deleteMembersBtn').on('click', deleteMember);
    //document.getElementById('getMembersBtn').addEventListener('click', console.log("Button Clicked") );
});