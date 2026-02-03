(function (window, $) {
  'use strict';

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function Calendar(opts) {
    this.$el = $(opts.el);
    this.apartment = opts.apartment;
    const now = new Date();
    this.year = opts.year || now.getFullYear();
    this.month = opts.month || (now.getMonth() + 1);
    this.render();
    this.bind();
    this.load();
  }

  Calendar.prototype.bind = function() {
    const self = this;
    this.$el.on('click', '.cal-prev', function(){ self.shiftMonth(-1); });
    this.$el.on('click', '.cal-next', function(){ self.shiftMonth(1); });
  };

  Calendar.prototype.shiftMonth = function(delta) {
    this.month += delta;
    if (this.month === 0) { this.month = 12; this.year -= 1; }
    if (this.month === 13) { this.month = 1; this.year += 1; }
    this.render();
    this.load();
  };

  Calendar.prototype.load = function() {
    const self = this;
    $.getJSON('api/calendar.php', {
      apartment: self.apartment,
      year: self.year,
      month: self.month
    }).done(function(res){
      self.paint(res.bookedDates || []);
    }).fail(function(){
      self.paint([]);
    });
  };

  Calendar.prototype.paint = function(bookedList) {
    const booked = new Set(bookedList);
    const now = new Date();
    const todayStr = now.getFullYear() + '-' + pad(now.getMonth()+1) + '-' + pad(now.getDate());
    this.$el.find('.cal-day').each(function(){
      const date = $(this).data('date');
      if (!date) return;
      // Treat all past dates as booked (not available)
      if (date < todayStr) {
        $(this).addClass('booked').removeClass('available');
      } else if (booked.has(date)) {
        $(this).addClass('booked').removeClass('available');
      } else {
        $(this).addClass('available').removeClass('booked');
      }
      if (date === todayStr) {
        $(this).addClass('today');
      } else {
        $(this).removeClass('today');
      }
    });
  };

  Calendar.prototype.render = function() {
    const first = new Date(this.year, this.month - 1, 1);
    const startDay = first.getDay() === 0 ? 7 : first.getDay(); // 1..7, Monday first
    const daysInMonth = new Date(this.year, this.month, 0).getDate();

    let html = '';
    html += '<div class="cal-header d-flex justify-content-between align-items-center mb-2">';
    html += '<a href="javascript:void(0);" class="cal-prev" title="Prethodni mesec"><i class="lni lni-chevron-left"></i></a>';
    html += '<div class="cal-title">' + pad(this.month) + ' - ' + this.year + '</div>';
    html += '<a href="javascript:void(0);" class="cal-next" title="Sledeći mesec"><i class="lni lni-chevron-right"></i></a>';
    html += '</div>';

    html += '<div class="cal-grid">';
    const weekdays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    for (let i=0;i<7;i++){ html += '<div class="cal-cell cal-head">'+weekdays[i]+'</div>'; }

    for (let i=1;i<startDay;i++) { html += '<div class="cal-cell cal-empty"></div>'; }
    for (let d=1; d<=daysInMonth; d++) {
      const dateStr = this.year + '-' + pad(this.month) + '-' + pad(d);
      html += '<div class="cal-cell cal-day" data-date="'+dateStr+'"><span class="n">'+d+'</span></div>';
    }
    html += '</div>';

    this.$el.html(html);
  };

  window.DejaCalendar = Calendar;

})(window, jQuery);


